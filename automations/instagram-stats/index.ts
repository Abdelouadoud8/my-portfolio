// Neon Function "igstats": at 23:59 Europe/Paris, snapshot the Instagram account's followers and
// follower gender split into social_stats.instagram_daily (one row per day, end-of-day values).
//
// Triggered by a Neon schedule at 21:59 and 22:59 UTC (cron is UTC only); the run that falls on
// 23:xx Paris time does the work, the other one exits. This keeps 23:59 local time across DST.
//
// Needs: social_stats.instagram_token (long-lived Instagram Login token, auto-refreshed here,
//        stored encrypted: see ../shared/token-crypto.mjs)
// Env:   STATS_DATABASE_URL (the Umami/stats DB in London; the function itself runs in the
//        Frankfurt project "portfolio-automations" because Functions aren't offered in eu-west-2),
//        RUN_SECRET (for manual runs), SMTP_EMAIL + SMTP_PASSWORD (Gmail, failure alerts),
//        TOKEN_ENCRYPTION_KEY (decrypts the stored token). STATS_DATABASE_URL uses the
//        least-privilege role "stats_automation", which can only touch the social_stats tables.
import { neon } from "@neondatabase/serverless";
import { Hono } from "hono";
import nodemailer from "nodemailer";
// @ts-expect-error plain JS module shared with fbstats
import { decryptToken, encryptToken } from "../shared/token-crypto.mjs";

const GRAPH_HOST = "https://graph.instagram.com";
const GRAPH = `${GRAPH_HOST}/v25.0`;
const TIMEZONE = "Europe/Paris";
// Refresh the 60-day token when it has less than this left (Instagram requires it to be > 24h old)
const REFRESH_WHEN_LESS_THAN_DAYS = 20;
// If refreshing keeps failing this close to expiry, fail the run so the alert email goes out
const FAIL_WHEN_LESS_THAN_DAYS = 5;
const TOKEN_TABLE = "instagram_token";

const sql = neon(process.env.STATS_DATABASE_URL ?? process.env.DATABASE_URL!);
const app = new Hono();

type Gender = { male: number; female: number; unknown: number };

function parisParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)!.value;
  return { date: `${get("year")}-${get("month")}-${get("day")}`, hour: Number(get("hour")) };
}

// The current day in Paris time (the 23:59 run records the day that is ending)
function statDateFor(now: Date) {
  return parisParts(now).date;
}

// The token goes in the Authorization header, never in the URL (URLs end up in logs and proxies).
// Only exception: /refresh_access_token, where Meta accepts the token nowhere else (header and POST
// body are refused); that call runs about once every 40 days, over HTTPS, and the URL is never
// logged or returned (errors only mention the path).
async function graph<T>(
  path: string,
  params: Record<string, string>,
  token: string,
  { base = GRAPH, tokenInQuery = false } = {},
): Promise<T> {
  const query = new URLSearchParams(tokenInQuery ? { ...params, access_token: token } : params);
  const res = await fetch(`${base}${path}?${query}`, {
    headers: tokenInQuery ? {} : { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(20_000),
  });
  const body = await res.json();
  if (!res.ok || body.error) {
    throw new Error(`Instagram API ${path}: ${res.status} ${JSON.stringify(body.error ?? body)}`);
  }
  return body as T;
}

async function getToken() {
  const rows = await sql`SELECT access_token, expires_at FROM social_stats.instagram_token WHERE id = 1`;
  if (!rows.length) throw new Error("No token in social_stats.instagram_token");
  const { access_token: stored, expires_at: expiresAt } = rows[0] as {
    access_token: string;
    expires_at: string | null;
  };
  let token = decryptToken(stored, TOKEN_TABLE) as string;

  const daysLeft = expiresAt ? (new Date(expiresAt).getTime() - Date.now()) / 86_400_000 : 0;
  if (daysLeft < REFRESH_WHEN_LESS_THAN_DAYS) {
    try {
      const refreshed = await graph<{ access_token: string; expires_in: number }>(
        "/refresh_access_token",
        { grant_type: "ig_refresh_token" },
        token,
        { base: GRAPH_HOST, tokenInQuery: true }, // unversioned endpoint, token only accepted in the URL
      );
      token = refreshed.access_token;
      await sql`
        UPDATE social_stats.instagram_token
        SET access_token = ${encryptToken(token, TOKEN_TABLE)},
            expires_at = now() + make_interval(secs => ${refreshed.expires_in}),
            updated_at = now()
        WHERE id = 1`;
      console.log(`token refreshed, valid ${Math.round(refreshed.expires_in / 86400)} days`);
    } catch (error) {
      // Keep going with the current token while it's still valid for a while
      console.error(`token refresh failed: ${(error as Error).message}`);
      if (daysLeft < FAIL_WHEN_LESS_THAN_DAYS) {
        throw new Error(`token refresh failed and the token expires in ${Math.max(0, Math.floor(daysLeft))} days`);
      }
    }
  }
  return token;
}

async function fetchInstagram(token: string) {
  const profile = await graph<{ followers_count: number; username: string }>(
    "/me",
    { fields: "followers_count,username" },
    token,
  );

  const insights = await graph<{ data: any[] }>("/me/insights", {
    metric: "follower_demographics",
    period: "lifetime",
    metric_type: "total_value",
    timeframe: "this_month",
    breakdown: "gender",
  }, token);

  const gender: Gender = { male: 0, female: 0, unknown: 0 };
  const results = insights.data?.[0]?.total_value?.breakdowns?.[0]?.results ?? [];
  for (const { dimension_values, value } of results) {
    // The gender code is the last dimension (the first one can be the timeframe)
    const code = String(dimension_values?.at(-1) ?? "").toUpperCase();
    if (code === "M") gender.male += value;
    else if (code === "F") gender.female += value;
    else gender.unknown += value;
  }

  return { username: profile.username, followers: profile.followers_count, gender };
}

async function collect(statDate: string, { dryRun = false } = {}) {
  const token = await getToken();
  const { username, followers, gender } = await fetchInstagram(token);

  const [previous] = (await sql`
    SELECT followers_count, male_count, female_count
    FROM social_stats.instagram_daily
    WHERE stat_date < ${statDate}
    ORDER BY stat_date DESC
    LIMIT 1`) as { followers_count: number; male_count: number | null; female_count: number | null }[];

  const knownGender = gender.male + gender.female;
  const pct = (n: number) => (knownGender ? Math.round((n / knownGender) * 10_000) / 100 : null);
  const diff = (now: number, before?: number | null) =>
    before === undefined || before === null ? null : now - before;

  const row = {
    stat_date: statDate,
    followers_count: followers,
    new_followers: diff(followers, previous?.followers_count),
    male_percentage: pct(gender.male),
    female_percentage: pct(gender.female),
    new_male_followers: diff(gender.male, previous?.male_count),
    new_female_followers: diff(gender.female, previous?.female_count),
    male_count: gender.male,
    female_count: gender.female,
    unknown_gender_count: gender.unknown,
  };

  if (!dryRun) {
    // Upsert: re-running a day (manual test, redelivery) keeps the latest values, so the 23:59 run wins
    await sql`
      INSERT INTO social_stats.instagram_daily (
        stat_date, followers_count, new_followers, male_percentage, female_percentage,
        new_male_followers, new_female_followers, male_count, female_count, unknown_gender_count
      ) VALUES (
        ${row.stat_date}, ${row.followers_count}, ${row.new_followers}, ${row.male_percentage},
        ${row.female_percentage}, ${row.new_male_followers}, ${row.new_female_followers},
        ${row.male_count}, ${row.female_count}, ${row.unknown_gender_count}
      )
      ON CONFLICT (stat_date) DO UPDATE SET
        followers_count = EXCLUDED.followers_count,
        new_followers = EXCLUDED.new_followers,
        male_percentage = EXCLUDED.male_percentage,
        female_percentage = EXCLUDED.female_percentage,
        new_male_followers = EXCLUDED.new_male_followers,
        new_female_followers = EXCLUDED.new_female_followers,
        male_count = EXCLUDED.male_count,
        female_count = EXCLUDED.female_count,
        unknown_gender_count = EXCLUDED.unknown_gender_count,
        collected_at = now()`;
  }

  console.log(`@${username} ${statDate}${dryRun ? " (dry run)" : ""}: ${JSON.stringify(row)}`);
  return row;
}

// Email the owner when the scheduled run fails (same Gmail account as the portfolio contact form)
async function sendFailureAlert(statDate: string, error: Error) {
  const { SMTP_EMAIL: email, SMTP_PASSWORD: password } = process.env;
  if (!email || !password) {
    console.error("alert not sent: SMTP_EMAIL / SMTP_PASSWORD missing");
    return;
  }
  try {
    await nodemailer
      .createTransport({ service: "Gmail", auth: { user: email, pass: password } })
      .sendMail({
        from: { name: "igstats automation", address: email },
        to: email,
        subject: `⚠️ Instagram stats not saved for ${statDate}`,
        text: [
          `The 23:59 Instagram snapshot for ${statDate} failed, so no row was saved.`,
          "",
          `Error: ${error.message}`,
          "",
          "What to check:",
          "- 'API access blocked' / OAuthException: open your Meta app dashboard (alerts, required actions).",
          "- Token errors: generate a new token and save it in social_stats.instagram_token.",
          "- Logs: Neon console > portfolio-automations > Functions > igstats.",
          "",
          "The missed day can be added by hand from Instagram > Professional dashboard > Followers.",
        ].join("\n"),
      });
    console.log(`failure alert sent for ${statDate}`);
  } catch (mailError) {
    console.error(`failure alert could not be sent: ${(mailError as Error).message}`);
  }
}

// Scheduled call from the Neon trigger (21:59 and 22:59 UTC)
app.post("/", async (c) => {
  if (!c.req.header("x-neon-trigger-invocation-id")) {
    return c.json({ error: "not a trigger call" }, 403);
  }
  const { data } = await c.req.json<{ data: { scheduled_at: string } }>();
  const scheduledAt = new Date(data.scheduled_at);

  // Only the run that lands at 23:xx Paris time does the work
  if (parisParts(scheduledAt).hour !== 23) {
    console.log(`skip ${data.scheduled_at}: not 23:59 in ${TIMEZONE}`);
    return c.json({ skipped: true });
  }

  const statDate = statDateFor(scheduledAt);
  try {
    const row = await collect(statDate);
    return c.json({ ok: true, row });
  } catch (error) {
    console.error(`igstats failed: ${(error as Error).message}`);
    await sendFailureAlert(statDate, error as Error);
    return c.json({ error: (error as Error).message }, 500);
  }
});

// Public, read-only: latest follower count (already public on the Instagram profile).
// Used by the portfolio's /links page, which refreshes it once a day.
app.get("/public/instagram", async (c) => {
  const [row] = (await sql`
    SELECT to_char(stat_date, 'YYYY-MM-DD') AS date, followers_count AS followers
    FROM social_stats.instagram_daily
    ORDER BY stat_date DESC
    LIMIT 1`) as { date: string; followers: number }[];

  if (!row) return c.json({ error: "no data yet" }, 404);

  c.header("Cache-Control", "public, max-age=3600");
  return c.json({ followers: row.followers, date: row.date });
});

// Manual run: POST /run with "Authorization: Bearer <RUN_SECRET>".
// ?dryRun=1 computes the row without saving it; ?date=YYYY-MM-DD overrides the day.
app.post("/run", async (c) => {
  const secret = process.env.RUN_SECRET;
  if (!secret || c.req.header("authorization") !== `Bearer ${secret}`) {
    return c.json({ error: "unauthorized" }, 401);
  }
  const statDate = c.req.query("date") ?? statDateFor(new Date());
  // ?testAlert=1 sends a sample failure email without touching Instagram or the database
  if (c.req.query("testAlert") === "1") {
    await sendFailureAlert(statDate, new Error("This is a test alert, nothing failed."));
    return c.json({ ok: true, alert: "sent" });
  }
  const row = await collect(statDate, { dryRun: c.req.query("dryRun") === "1" });
  return c.json({ ok: true, row });
});

app.onError((error, c) => {
  console.error(`igstats failed: ${error.message}`);
  return c.json({ error: error.message }, 500);
});

export default app;
