// Follow-up ("relance") to everyone who started registering for a session in the bot but didn't pay yet
// (stopped at the name, the phone or the payment step; nobody who paid or has a receipt under review).
// Each message has a "كمّل التسجيل" button that resumes their registration where they stopped.
// Records relance_sent_at; the bot records relance_seen_at when they tap the button or write to it (see /list).
// People already followed up are skipped, so running it twice never sends twice.
//
//   node send-relance.mjs <sessionId> --test   sends the message to the admin only (nothing recorded)
//   node send-relance.mjs <sessionId> --dry    lists how many people would get it
//   node send-relance.mjs <sessionId> --send   sends it for real
//
// Reads TELEGRAM_BOT_TOKEN, TELEGRAM_ADMIN_CHAT_ID, TRAINING_BOT_DATABASE_URL from .env.local (never printed).
// The text below is the last reminder for the 21 Nov session, a few hours before it (2026-11-21): edit it before reusing the script.
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

const env = Object.fromEntries(
  readFileSync(new URL("../../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((line) => /^[A-Za-z_][A-Za-z0-9_]*=/.test(line))
    .map((line) => [line.slice(0, line.indexOf("=")), line.slice(line.indexOf("=") + 1).replace(/^["']|["']$/g, "")]),
);
const [sessionId, mode, ...flags] = process.argv.slice(2);
// Optional: --skip=12,34 leaves these registration ids out (e.g. people just written to by hand, or who blocked the bot)
const skipArg = flags.find((f) => f.startsWith("--skip="));
const skip = (skipArg ? skipArg.slice(7).split(",") : []).map(Number).filter(Boolean);
// Optional: --again also sends to people who already got a follow-up (a second, different message)
const again = flags.includes("--again");
if (!sessionId || !["--test", "--dry", "--send"].includes(mode)) {
  console.error("usage: node send-relance.mjs <sessionId> --test | --dry | --send [--skip=<id>,<id>] [--again]");
  process.exit(1);
}

const TEXT = [
  "⏳🚨 <b>آخر فرصة لتسجيل!!!</b> 🚨⏳",
  "",
  "باقي <b>غير ساعات قليلة</b> على حصة <b>«أساسيات الذكاء الإصطناعي»</b> 🤖",
  "",
  "👇 <b>كمّل التسجيل دركا قبل ما تنغلق:</b>",
].join("\n");

async function sendRelance(chatId) {
  const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: TEXT,
      parse_mode: "HTML",
      reply_markup: { inline_keyboard: [[{ text: "✅ كمّل التسجيل دركا", callback_data: `relance:${sessionId}` }]] },
    }),
  });
  const json = await res.json();
  // Never log the URL: it contains the bot token
  if (!json.ok) throw new Error(json.description);
}

if (mode === "--test") {
  await sendRelance(env.TELEGRAM_ADMIN_CHAT_ID);
  console.log("sent to the admin only");
  process.exit(0);
}

const sql = neon(env.TRAINING_BOT_DATABASE_URL);
const rows = await sql`
  SELECT r.id, r.tg_user_id FROM training_bot.registrations r
  WHERE r.session_id = ${sessionId}
    AND r.status IN ('awaiting_name', 'awaiting_phone', 'awaiting_receipt', 'rejected')
    AND (${again} OR r.relance_sent_at IS NULL)
    AND r.tg_user_id <> ${Number(env.TELEGRAM_ADMIN_CHAT_ID)}
    AND NOT EXISTS (
      SELECT 1 FROM training_bot.registrations p
      WHERE p.tg_user_id = r.tg_user_id AND p.status IN ('paid', 'pending_review'))
  ORDER BY r.id`.then((all) => all.filter((r) => !skip.includes(Number(r.id))));
console.log(`${rows.length} people to follow up: ${rows.map((r) => r.id).join(", ")}`);
if (mode === "--dry") process.exit(0);

let sent = 0;
const failed = [];
for (const row of rows) {
  try {
    await sendRelance(row.tg_user_id);
    await sql`UPDATE training_bot.registrations SET relance_sent_at = now(), relance_seen_at = NULL WHERE id = ${row.id}`;
    sent++;
  } catch (error) {
    // e.g. "Forbidden: bot was blocked by the user"
    failed.push(`registration ${row.id}: ${error.message}`);
  }
  await new Promise((resolve) => setTimeout(resolve, 100)); // stay far below Telegram's 30 messages/second
}
console.log(`sent: ${sent}, failed: ${failed.length}`);
for (const line of failed) console.log(`  ${line}`);
