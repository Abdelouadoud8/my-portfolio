// Follow-up to ONE paid participant who hasn't joined the session's group yet: sends the group link plus a
// "✅ شفت الرسالة" button. Telegram gives bots no read receipts, so "seen" = they tap the button or write to the bot
// (relance_seen_at, shown in /list); joining the group sets joined_at.
//
//   node send-group-link.mjs <registrationId> --test   sends the message to the admin only (nothing recorded)
//   node send-group-link.mjs <registrationId> --send   sends it to that participant and records relance_sent_at
//
// Reads TELEGRAM_BOT_TOKEN, TELEGRAM_ADMIN_CHAT_ID, TRAINING_BOT_DATABASE_URL from .env.local (never printed).
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

const env = Object.fromEntries(
  readFileSync(new URL("../../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((line) => /^[A-Za-z_][A-Za-z0-9_]*=/.test(line))
    .map((line) => [line.slice(0, line.indexOf("=")), line.slice(line.indexOf("=") + 1).replace(/^["']|["']$/g, "")]),
);
const [regId, mode] = process.argv.slice(2);
if (!Number(regId) || !["--test", "--send"].includes(mode)) {
  console.error("usage: node send-group-link.mjs <registrationId> --test | --send");
  process.exit(1);
}

const sql = neon(env.TRAINING_BOT_DATABASE_URL);
const [row] = await sql`
  SELECT r.id, r.tg_user_id, r.status, r.joined_at, s.label, s.invite_link
  FROM training_bot.registrations r JOIN training_bot.sessions s ON s.id = r.session_id
  WHERE r.id = ${Number(regId)}`;
if (!row) throw new Error(`registration ${regId} not found`);
if (row.status !== "paid") throw new Error(`registration ${regId} is ${row.status}, not paid`);
if (row.joined_at) throw new Error(`registration ${regId} already joined the group`);
if (!row.invite_link) throw new Error("this session has no group link yet (/setgroup)");

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const text = [
  "👋 السلام عليكم،",
  "",
  `✅ الدفع ديالك تأكد لحصة <b>${esc(row.label)}</b>`,
  "",
  "باقي غير تدخل لمجموعة التلغرام باش توصلك كل المعلومات و رابط الحصة 🙏",
  "",
  "👇 ادخل من هاد الرابط و ابعث طلب الانضمام، يتقبل أوتوماتيكيا:",
  row.invite_link,
].join("\n");

const chatId = mode === "--test" ? env.TELEGRAM_ADMIN_CHAT_ID : row.tg_user_id;
const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    reply_markup: { inline_keyboard: [[{ text: "✅ شفت الرسالة", callback_data: "seen" }]] },
  }),
});
const json = await res.json();
// Never log the URL: it contains the bot token
if (!json.ok) throw new Error(json.description);

if (mode === "--send") {
  await sql`UPDATE training_bot.registrations SET relance_sent_at = now(), relance_seen_at = NULL WHERE id = ${row.id}`;
  console.log(`sent to registration ${row.id}`);
} else {
  console.log("sent to the admin only");
}
