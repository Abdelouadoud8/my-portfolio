// Neon Function "fbstats": at 23:59 Europe/Paris, snapshot the Facebook Page's followers into
// social_stats.facebook_daily (one row per day). Fully independent from "igstats" (own code,
// token, table, trigger and alert), so one platform failing never stops the other.
//
// Triggered by a Neon schedule at 21:59 and 22:59 UTC (cron is UTC only); the run that falls on
// 23:xx Paris time does the work, the other one exits. This keeps 23:59 local time across DST.
//
// Meta removed Page follower gender/age breakdowns from the API in March 2024, so this records
// followers, net new followers, Page Insights follows/unfollows and (best effort) top countries.
//
// Needs: social_stats.facebook_token (Page ID + long-lived Page access token; Page tokens
//        obtained from a long-lived user token do not expire, so no refresh logic)
// Env:   STATS_DATABASE_URL (the Umami/stats DB in London), RUN_SECRET (manual runs),
//        SMTP_EMAIL + SMTP_PASSWORD (Gmail, failure alerts)
import { neon } from "@neondatabase/serverless";
import { Hono } from "hono";
import nodemailer from "nodemailer";

const GRAPH = "https://graph.facebook.com/v25.0";
const TIMEZONE = "Europe/Paris";
// Page Insights "day" values end at midnight Pacific time
const INSIGHTS_TIMEZONE = "America/Los_Angeles";
// Tried in order; Meta renamed fan metrics to follower metrics in 2026
const COUNTRY_METRICS = ["page_follows_country", "page_fans_country"];

const sql = neon(process.env.STATS_DATABASE_URL ?? process.env.DATABASE_URL!);
const app = new Hono();

function dateParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
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
  return dateParts(now, TIMEZONE).date;
}

async function graph<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = `${GRAPH}${path}?${new URLSearchParams(params)}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  const body = await res.json();
  if (!res.ok || body.error) {
    throw new Error(`Facebook API ${path}: ${res.status} ${JSON.stringify(body.error ?? body)}`);
  }
  return body as T;
}

async function getToken() {
  const rows = await sql`SELECT page_id, access_token FROM social_stats.facebook_token WHERE id = 1`;
  if (!rows.length) throw new Error("No Page token in social_stats.facebook_token");
  const { page_id: pageId, access_token: token } = rows[0] as {
    page_id: string;
    access_token: string;
  };
  return { pageId, token };
}

type InsightsValue = { value: unknown; end_time: string };
type InsightsResponse = { data: { name: string; values: InsightsValue[] }[] };

// Latest complete day of a "day" metric: { value, date } where date is the day the value covers
function latestDay(values: InsightsValue[] | undefined) {
  const last = values?.at(-1);
  if (!last) return undefined;
  // end_time is the end of the covered day (midnight Pacific), so step back one hour
  const covered = new Date(new Date(last.end_time).getTime() - 60 * 60 * 1000);
  return { value: last.value, date: dateParts(covered, INSIGHTS_TIMEZONE).date };
}

async function fetchFacebook(pageId: string, token: string) {
  const page = await graph<{ name: string; followers_count: number }>(`/${pageId}`, {
    fields: "name,followers_count",
    access_token: token,
  });

  // Follows / unfollows: optional, the row is still saved if Insights fails
  let follows: number | null = null;
  let unfollows: number | null = null;
  let insightsDate: string | null = null;
  try {
    const insights = await graph<InsightsResponse>(`/${pageId}/insights`, {
      metric: "page_daily_follows_unique,page_daily_unfollows_unique",
      period: "day",
      access_token: token,
    });
    const byName = Object.fromEntries(insights.data.map((m) => [m.name, latestDay(m.values)]));
    const f = byName.page_daily_follows_unique;
    const u = byName.page_daily_unfollows_unique;
    follows = typeof f?.value === "number" ? f.value : null;
    unfollows = typeof u?.value === "number" ? u.value : null;
    insightsDate = f?.date ?? u?.date ?? null;
  } catch (error) {
    console.warn(`follows/unfollows unavailable: ${(error as Error).message}`);
  }

  // Followers by country: best effort, Meta changes these metrics often
  let topCountries: Record<string, number> | null = null;
  for (const metric of COUNTRY_METRICS) {
    try {
      const res = await graph<InsightsResponse>(`/${pageId}/insights`, {
        metric,
        period: "day",
        access_token: token,
      });
      const latest = latestDay(res.data?.[0]?.values);
      if (latest && latest.value && typeof latest.value === "object") {
        topCountries = latest.value as Record<string, number>;
        break;
      }
    } catch (error) {
      console.warn(`${metric} unavailable: ${(error as Error).message}`);
    }
  }

  return { name: page.name, followers: page.followers_count, follows, unfollows, insightsDate, topCountries };
}

async function collect(statDate: string, { dryRun = false } = {}) {
  const { pageId, token } = await getToken();
  const fb = await fetchFacebook(pageId, token);

  const [previous] = (await sql`
    SELECT followers_count
    FROM social_stats.facebook_daily
    WHERE stat_date < ${statDate}
    ORDER BY stat_date DESC
    LIMIT 1`) as { followers_count: number }[];

  const row = {
    stat_date: statDate,
    followers_count: fb.followers,
    new_followers: previous ? fb.followers - previous.followers_count : null,
    follows: fb.follows,
    unfollows: fb.unfollows,
    insights_date: fb.insightsDate,
    top_countries: fb.topCountries,
  };

  if (!dryRun) {
    // Upsert: re-running a day (manual test, redelivery) keeps the latest values, so the 23:59 run wins
    await sql`
      INSERT INTO social_stats.facebook_daily (
        stat_date, followers_count, new_followers, follows, unfollows, insights_date, top_countries
      ) VALUES (
        ${row.stat_date}, ${row.followers_count}, ${row.new_followers}, ${row.follows},
        ${row.unfollows}, ${row.insights_date},
        ${row.top_countries ? JSON.stringify(row.top_countries) : null}::jsonb
      )
      ON CONFLICT (stat_date) DO UPDATE SET
        followers_count = EXCLUDED.followers_count,
        new_followers = EXCLUDED.new_followers,
        follows = EXCLUDED.follows,
        unfollows = EXCLUDED.unfollows,
        insights_date = EXCLUDED.insights_date,
        top_countries = EXCLUDED.top_countries,
        collected_at = now()`;
  }

  console.log(`${fb.name} ${statDate}${dryRun ? " (dry run)" : ""}: ${JSON.stringify(row)}`);
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
        from: { name: "fbstats automation", address: email },
        to: email,
        subject: `⚠️ Facebook stats not saved for ${statDate}`,
        text: [
          `The 23:59 Facebook Page snapshot for ${statDate} failed, so no row was saved.`,
          "(Instagram runs separately and is not affected.)",
          "",
          `Error: ${error.message}`,
          "",
          "What to check:",
          "- Token errors (OAuthException 190): generate a new Page token and update social_stats.facebook_token.",
          "- Permission errors: the app needs pages_show_list, pages_read_engagement and read_insights.",
          "- Logs: Neon console > portfolio-automations > Functions > fbstats.",
          "",
          "The missed day can be added by hand from Meta Business Suite > Insights.",
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
  if (dateParts(scheduledAt, TIMEZONE).hour !== 23) {
    console.log(`skip ${data.scheduled_at}: not 23:59 in ${TIMEZONE}`);
    return c.json({ skipped: true });
  }

  const statDate = statDateFor(scheduledAt);
  try {
    const row = await collect(statDate);
    return c.json({ ok: true, row });
  } catch (error) {
    console.error(`fbstats failed: ${(error as Error).message}`);
    await sendFailureAlert(statDate, error as Error);
    return c.json({ error: (error as Error).message }, 500);
  }
});

// Public, read-only: latest follower count (already public on the Page).
// Used by the portfolio's /links page, which refreshes it once a day.
app.get("/public/facebook", async (c) => {
  const [row] = (await sql`
    SELECT to_char(stat_date, 'YYYY-MM-DD') AS date, followers_count AS followers
    FROM social_stats.facebook_daily
    ORDER BY stat_date DESC
    LIMIT 1`) as { date: string; followers: number }[];

  if (!row) return c.json({ error: "no data yet" }, 404);

  c.header("Cache-Control", "public, max-age=3600");
  return c.json({ followers: row.followers, date: row.date });
});

// Manual run: POST /run with "Authorization: Bearer <RUN_SECRET>".
// ?dryRun=1 computes the row without saving it; ?date=YYYY-MM-DD overrides the day;
// ?testAlert=1 sends a sample failure email without calling Facebook or the database.
app.post("/run", async (c) => {
  const secret = process.env.RUN_SECRET;
  if (!secret || c.req.header("authorization") !== `Bearer ${secret}`) {
    return c.json({ error: "unauthorized" }, 401);
  }
  const statDate = c.req.query("date") ?? statDateFor(new Date());
  if (c.req.query("testAlert") === "1") {
    await sendFailureAlert(statDate, new Error("This is a test alert, nothing failed."));
    return c.json({ ok: true, alert: "sent" });
  }
  const row = await collect(statDate, { dryRun: c.req.query("dryRun") === "1" });
  return c.json({ ok: true, row });
});

app.onError((error, c) => {
  console.error(`fbstats failed: ${error.message}`);
  return c.json({ error: error.message }, 500);
});

export default app;
