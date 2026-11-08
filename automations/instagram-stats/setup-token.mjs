// One-off: save a new long-lived Instagram token for igstats (encrypted at rest).
// Reads IG_TOKEN, STATS_DATABASE_URL (owner URL) and TOKEN_ENCRYPTION_KEY from the env. Never prints the token.
// Remove IG_TOKEN from .env.local afterwards.
import { neon } from "@neondatabase/serverless";
import { encryptToken } from "../shared/token-crypto.mjs";

const { IG_TOKEN: token, STATS_DATABASE_URL: dbUrl } = process.env;
if (!token) throw new Error("Add IG_TOKEN (the new long-lived Instagram token) to .env.local");
if (!dbUrl) throw new Error("STATS_DATABASE_URL missing in .env.local");

// Token goes in the Authorization header, never in the URL
const res = await fetch("https://graph.instagram.com/v25.0/me?fields=username,followers_count", {
  headers: { Authorization: `Bearer ${token}` },
});
const body = await res.json();
if (!res.ok || body.error) throw new Error(`Token rejected: ${body.error?.message ?? res.status}`);
console.log(`Token OK: @${body.username}, ${body.followers_count} followers`);

// Long-lived tokens last 60 days; igstats refreshes it when fewer than 20 days remain
const sql = neon(dbUrl);
await sql`
  INSERT INTO social_stats.instagram_token (id, access_token, expires_at)
  VALUES (1, ${encryptToken(token, "instagram_token")}, now() + interval '60 days')
  ON CONFLICT (id) DO UPDATE SET access_token = EXCLUDED.access_token,
    expires_at = EXCLUDED.expires_at, updated_at = now()`;
console.log("saved (encrypted) in social_stats.instagram_token, expires in 60 days");
