// Copy the trainings' sessions from the website data (data/trainings/trainings.ts) into the bot's database,
// so the website stays the single place to edit dates, prices, seats and which sessions are open.
// Run after every change to the sessions: node sync-sessions.mjs
// Keeps each session's Telegram group (set with /setgroup). Uses TRAINING_BOT_DATABASE_URL from .env.local.
import { readFileSync } from "node:fs";
import { build } from "esbuild";
import { neon } from "@neondatabase/serverless";

const env = Object.fromEntries(
  readFileSync(new URL("../../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((line) => /^[A-Za-z_][A-Za-z0-9_]*=/.test(line))
    .map((line) => [line.slice(0, line.indexOf("=")), line.slice(line.indexOf("=") + 1).replace(/^["']|["']$/g, "")]),
);
if (!env.TRAINING_BOT_DATABASE_URL) throw new Error("Run setup-db.mjs first (TRAINING_BOT_DATABASE_URL missing)");

// The data file is TypeScript: bundle it to an ES module in memory (its type-only imports disappear)
const bundle = await build({
  entryPoints: [new URL("../../data/trainings/trainings.ts", import.meta.url).pathname],
  bundle: true,
  format: "esm",
  platform: "node",
  write: false,
});
const { trainings } = await import(
  `data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString("base64")}`
);

const sql = neon(env.TRAINING_BOT_DATABASE_URL);
let count = 0;
for (const training of trainings) {
  for (const session of training.sessions ?? []) {
    if (!session.id) throw new Error(`${training.id}: a session has no id`);
    const id = `${training.id}_${session.id}`;
    const label = session.time ? `${session.date} · ${session.time}` : session.date;
    await sql`
      INSERT INTO training_bot.sessions (id, training_id, label, price, seats, reserved_seats, booking_open)
      VALUES (${id}, ${training.id}, ${label}, ${session.price}, ${session.seats}, ${session.reservedSeats ?? 0},
              ${Boolean(session.bookingOpen)})
      ON CONFLICT (id) DO UPDATE SET
        label = EXCLUDED.label, price = EXCLUDED.price, seats = EXCLUDED.seats,
        reserved_seats = EXCLUDED.reserved_seats, booking_open = EXCLUDED.booking_open, updated_at = now()`;
    console.log(`${id}: ${session.bookingOpen ? "open" : "closed"}, ${session.seats} seats`);
    count++;
  }
}
console.log(`synced ${count} sessions`);
