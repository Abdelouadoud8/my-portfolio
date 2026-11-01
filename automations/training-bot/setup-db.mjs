// One-off: create the training bot's tables and its least-privilege role in the Frankfurt project, then save
// TRAINING_BOT_DATABASE_URL (and a TELEGRAM_WEBHOOK_SECRET if missing) to .env.local. Safe to run again:
// tables use IF NOT EXISTS, and an existing role only gets a new password.
// Needs NEON_API_KEY in .env.local. Never prints secrets.
import { readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { neon } from "@neondatabase/serverless";

const PROJECT_ID = "young-wildflower-73641515";
const BRANCH_ID = "br-steep-resonance-b1bwn48v";
const DATABASE = "neondb";
const OWNER = "neondb_owner";
const ROLE = "training_bot";
const ENV_FILE = new URL("../../.env.local", import.meta.url);
const API = `https://console.neon.tech/api/v2/projects/${PROJECT_ID}`;

const env = Object.fromEntries(
  readFileSync(ENV_FILE, "utf8")
    .split("\n")
    .filter((line) => /^[A-Za-z_][A-Za-z0-9_]*=/.test(line))
    .map((line) => [line.slice(0, line.indexOf("=")), line.slice(line.indexOf("=") + 1).replace(/^["']|["']$/g, "")]),
);
if (!env.NEON_API_KEY) throw new Error("Add NEON_API_KEY to .env.local");

async function neonApi(path, init = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${env.NEON_API_KEY}`, "Content-Type": "application/json", ...init.headers },
  });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}

function setEnv(key, value) {
  const text = readFileSync(ENV_FILE, "utf8");
  const line = `${key}=${value}`;
  const next = new RegExp(`^${key}=.*$`, "m").test(text)
    ? text.replace(new RegExp(`^${key}=.*$`, "m"), line)
    : `${text.replace(/\n?$/, "\n")}${line}\n`;
  writeFileSync(ENV_FILE, next);
}

// 1. Owner connection (only used here, never saved)
const owner = await neonApi(
  `/connection_uri?branch_id=${BRANCH_ID}&database_name=${DATABASE}&role_name=${OWNER}`,
);
if (!owner.body.uri) throw new Error(`owner connection: HTTP ${owner.status} ${owner.body.message ?? ""}`);
const ownerSql = neon(owner.body.uri);

// 2. Tables
const schema = readFileSync(new URL("./schema.sql", import.meta.url), "utf8")
  .replace(/--.*$/gm, "")
  .split(";")
  .map((statement) => statement.trim())
  .filter(Boolean);
for (const statement of schema) await ownerSql.query(statement);
console.log(`schema: ${schema.length} statements applied`);

// 3. Role (create, or reset the password of the existing one)
let role = await neonApi(`/branches/${BRANCH_ID}/roles`, {
  method: "POST",
  body: JSON.stringify({ role: { name: ROLE } }),
});
if (role.status === 409 || /already exists/i.test(role.body.message ?? "")) {
  role = await neonApi(`/branches/${BRANCH_ID}/roles/${ROLE}/reset_password`, { method: "POST" });
}
const password = role.body.role?.password;
if (!password) throw new Error(`role: HTTP ${role.status} ${role.body.message ?? ""}`);
console.log(`role ${ROLE}: ready`);

// 4. Least privilege: read/write the bot's tables only (no DELETE, no DDL, nothing outside training_bot)
for (const statement of [
  `GRANT USAGE ON SCHEMA training_bot TO ${ROLE}`,
  `GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA training_bot TO ${ROLE}`,
  `GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA training_bot TO ${ROLE}`,
  `REVOKE CREATE ON SCHEMA public FROM ${ROLE}`,
  // (no "ALTER ROLE ... SET statement_timeout": on Neon only the Console/API can alter roles)
]) {
  await ownerSql.query(statement);
}
console.log("grants: done");

// 5. Save the bot's connection string (and a webhook secret) to .env.local
const url = new URL(owner.body.uri);
url.username = ROLE;
url.password = password;
setEnv("TRAINING_BOT_DATABASE_URL", url.toString());
if (!env.TELEGRAM_WEBHOOK_SECRET) setEnv("TELEGRAM_WEBHOOK_SECRET", randomBytes(24).toString("hex"));
console.log("saved TRAINING_BOT_DATABASE_URL (and TELEGRAM_WEBHOOK_SECRET if it was missing) to .env.local");
