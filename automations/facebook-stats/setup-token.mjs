// One-off: turn a long-lived USER token into the Page token fbstats needs, then save it.
// Reads FB_USER_TOKEN (+ optional FB_PAGE_ID) and STATS_DATABASE_URL from the env. Never prints tokens.
import { neon } from "@neondatabase/serverless";

const GRAPH = "https://graph.facebook.com/v25.0";
const { FB_USER_TOKEN: userToken, STATS_DATABASE_URL: dbUrl } = process.env;
// Public ID of the Page (fb://profile/… in its link preview); used if /me/accounts lists nothing
const FALLBACK_PAGE_ID = process.env.FB_PAGE_ID || "61593759236599";
const REQUIRED = ["pages_show_list", "pages_read_engagement", "read_insights"];

if (!userToken) throw new Error("Add FB_USER_TOKEN (the long-lived user token) to .env.local");
if (!dbUrl) throw new Error("STATS_DATABASE_URL missing in .env.local");

async function graph(path, params) {
  const res = await fetch(`${GRAPH}${path}?${new URLSearchParams(params)}`);
  const body = await res.json();
  if (!res.ok || body.error) {
    const e = body.error ?? {};
    throw new Error(`${path}: ${e.message ?? res.status} (code ${e.code ?? "?"})`);
  }
  return body;
}

// 1. Which permissions does the user token really have?
const { data: perms } = await graph("/me/permissions", { access_token: userToken });
const granted = perms.filter((p) => p.status === "granted").map((p) => p.permission);
console.log("granted permissions:", granted.join(", ") || "(none)");
const missing = REQUIRED.filter((p) => !granted.includes(p));
if (missing.length) console.log("MISSING permissions:", missing.join(", "));

// 2. Pages visible to the token
const { data: pages } = await graph("/me/accounts", {
  fields: "id,name,access_token,tasks",
  access_token: userToken,
});
console.log(
  `pages from /me/accounts: ${pages.length ? pages.map((p) => `${p.name} (${p.id}) tasks=${(p.tasks || []).join("|")}`).join("; ") : "(none)"}`
);

// 3. Pick the Page (the only one, or by FB_PAGE_ID), else ask for it directly by ID
let page = pages.find((p) => p.id === process.env.FB_PAGE_ID) ?? (pages.length === 1 ? pages[0] : undefined);
if (!page && pages.length > 1) {
  throw new Error("Several Pages: add FB_PAGE_ID=<id> to .env.local with the right one from the list above");
}
// Pages owned by (or shared with) a Business portfolio need business_management to be listed
if (!page && granted.includes("business_management")) {
  const { data: businesses } = await graph("/me/businesses", { fields: "id,name", access_token: userToken });
  console.log(`business portfolios: ${businesses.map((b) => `${b.name} (${b.id})`).join("; ") || "(none)"}`);
  for (const business of businesses) {
    for (const edge of ["owned_pages", "client_pages"]) {
      try {
        const { data } = await graph(`/${business.id}/${edge}`, {
          fields: "id,name,access_token",
          access_token: userToken,
        });
        console.log(`  ${business.name} ${edge}: ${data.map((p) => `${p.name} (${p.id})`).join("; ") || "(none)"}`);
        page ??= data.find((p) => !process.env.FB_PAGE_ID || p.id === process.env.FB_PAGE_ID);
      } catch (error) {
        console.log(`  ${business.name} ${edge}: ${error.message}`);
      }
    }
  }
}
if (!page) {
  console.log(`trying the Page directly by ID ${FALLBACK_PAGE_ID}…`);
  page = await graph(`/${FALLBACK_PAGE_ID}`, { fields: "id,name,access_token", access_token: userToken });
}
if (!page.access_token) {
  throw new Error(`No Page token returned for ${page.name ?? page.id}: you must be an admin of the Page and grant it in the login dialog`);
}

// 4. Check the Page token works for what fbstats reads
const check = await graph(`/${page.id}`, { fields: "name,followers_count", access_token: page.access_token });
console.log(`Page token OK: ${check.name} (${page.id}), ${check.followers_count} followers`);
try {
  await graph(`/${page.id}/insights`, {
    metric: "page_daily_follows_unique",
    period: "day",
    access_token: page.access_token,
  });
  console.log("insights (follows/unfollows): OK");
} catch (error) {
  console.log(`insights not available yet: ${error.message}`);
}

// 5. Save it for fbstats
const sql = neon(dbUrl);
await sql`
  INSERT INTO social_stats.facebook_token (page_id, access_token)
  VALUES (${page.id}, ${page.access_token})
  ON CONFLICT (id) DO UPDATE SET page_id = EXCLUDED.page_id,
    access_token = EXCLUDED.access_token, updated_at = now()`;
console.log("saved in social_stats.facebook_token");
