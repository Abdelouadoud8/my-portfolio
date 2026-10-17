// Encryption at rest for the Meta tokens saved in social_stats.*_token (AES-256-GCM).
// The key lives only in the functions' environment (TOKEN_ENCRYPTION_KEY, 32 bytes in base64) and in
// .env.local, never in the database: a leaked table, branch or backup doesn't leak a usable token.
// Stored format: "v1:<iv>:<auth tag>:<ciphertext>" (base64). The table name is bound as additional
// data, so a value can't be moved from one token table to another.
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const PREFIX = "v1";

function key() {
  const raw = process.env.TOKEN_ENCRYPTION_KEY;
  const buf = raw ? Buffer.from(raw, "base64") : Buffer.alloc(0);
  if (buf.length !== 32) throw new Error("TOKEN_ENCRYPTION_KEY missing or not 32 bytes (base64)");
  return buf;
}

/** @param {string} token @param {string} table e.g. "instagram_token" */
export function encryptToken(token, table) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  cipher.setAAD(Buffer.from(table));
  const data = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  return [PREFIX, iv, cipher.getAuthTag(), data].map((p) => (typeof p === "string" ? p : p.toString("base64"))).join(":");
}

/** Refuses plain-text values: every stored token must be encrypted. @returns {string} */
export function decryptToken(stored, table) {
  const [prefix, iv, tag, data] = String(stored).split(":");
  if (prefix !== PREFIX || !iv || !tag || !data) throw new Error(`${table}: stored token is not encrypted`);
  const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(iv, "base64"));
  decipher.setAAD(Buffer.from(table));
  decipher.setAuthTag(Buffer.from(tag, "base64"));
  return Buffer.concat([decipher.update(Buffer.from(data, "base64")), decipher.final()]).toString("utf8");
}
