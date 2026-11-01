// Telegram side of the training bot. Reads TELEGRAM_BOT_TOKEN (and the rest) from .env.local, never prints secrets.
//   node telegram-setup.mjs admin    after you sent any message to the bot from your own account: saves your chat id
//                                    as TELEGRAM_ADMIN_CHAT_ID (run it BEFORE "webhook": Telegram keeps updates for
//                                    getUpdates only while no webhook is set)
//   node telegram-setup.mjs webhook  points Telegram at the deployed function and sets the command menus
//   node telegram-setup.mjs info     bot username + webhook status (last error, pending updates)
import { readFileSync, writeFileSync } from "node:fs";

const ENV_FILE = new URL("../../.env.local", import.meta.url);
const FUNCTION_URL = "https://br-steep-resonance-b1bwn48v-trainbot.compute.c-5.eu-central-1.aws.neon.tech";

const env = Object.fromEntries(
  readFileSync(ENV_FILE, "utf8")
    .split("\n")
    .filter((line) => /^[A-Za-z_][A-Za-z0-9_]*=/.test(line))
    .map((line) => [line.slice(0, line.indexOf("=")), line.slice(line.indexOf("=") + 1).replace(/^["']|["']$/g, "")]),
);
if (!env.TELEGRAM_BOT_TOKEN) throw new Error("Add TELEGRAM_BOT_TOKEN (from @BotFather) to .env.local");

async function tg(method, body = {}) {
  const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(`${method}: ${json.description}`);
  return json.result;
}

function setEnv(key, value) {
  const text = readFileSync(ENV_FILE, "utf8");
  const line = `${key}=${value}`;
  const next = new RegExp(`^${key}=.*$`, "m").test(text)
    ? text.replace(new RegExp(`^${key}=.*$`, "m"), line)
    : `${text.replace(/\n?$/, "\n")}${line}\n`;
  writeFileSync(ENV_FILE, next);
}

const command = process.argv[2];
const me = await tg("getMe");

if (command === "admin") {
  const updates = await tg("getUpdates", { allowed_updates: ["message"] });
  const last = updates.map((u) => u.message).filter((m) => m?.chat?.type === "private").at(-1);
  if (!last) {
    console.log(`No private message found. Open t.me/${me.username}, send "hi", then run this again.`);
    process.exit(1);
  }
  setEnv("TELEGRAM_ADMIN_CHAT_ID", String(last.from.id));
  console.log(`Saved TELEGRAM_ADMIN_CHAT_ID for ${last.from.first_name}. Now run ./deploy.sh, then: node telegram-setup.mjs webhook`);
} else if (command === "webhook") {
  if (!env.TELEGRAM_WEBHOOK_SECRET) throw new Error("Run node setup-db.mjs first (TELEGRAM_WEBHOOK_SECRET missing)");
  await tg("setWebhook", {
    url: `${FUNCTION_URL}/telegram`,
    secret_token: env.TELEGRAM_WEBHOOK_SECRET,
    allowed_updates: ["message", "callback_query", "chat_join_request"],
    drop_pending_updates: true,
  });
  await tg("setMyCommands", {
    commands: [
      { command: "start", description: "التسجيل في حصة" },
      { command: "cancel", description: "إلغاء التسجيل الجاري" },
    ],
  });
  if (env.TELEGRAM_ADMIN_CHAT_ID) {
    await tg("setMyCommands", {
      scope: { type: "chat", chat_id: Number(env.TELEGRAM_ADMIN_CHAT_ID) },
      commands: [
        { command: "list", description: "الحصص و المسجلين" },
        { command: "remind", description: "رسالة لكل اللي خلصو: /remind <session> <text>" },
        { command: "sendlinks", description: "يعاود يبعث رابط المجموعة: /sendlinks <session>" },
        { command: "help", description: "أوامر الأدمين" },
      ],
    });
  }
  await tg("setMyDescription", {
    description: "التسجيل في دورات ودود: اختار الحصة، ابعث وصل الدفع، و ادخل للمجموعة بعد ما يتأكد الدفع.",
  });
  console.log(`Webhook set for @${me.username}. Put telegramBot: "${me.username}" in data/trainings/trainings.ts`);
} else if (command === "info") {
  const info = await tg("getWebhookInfo");
  console.log(
    JSON.stringify(
      {
        bot: `@${me.username}`,
        webhook: info.url || "(none)",
        pending: info.pending_update_count,
        lastError: info.last_error_message ?? null,
        lastErrorAt: info.last_error_date ? new Date(info.last_error_date * 1000).toISOString() : null,
      },
      null,
      2,
    ),
  );
} else {
  console.log("usage: node telegram-setup.mjs admin | webhook | info");
}
