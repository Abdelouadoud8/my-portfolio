// Latest Instagram follower count, saved every day at 23:59 (Paris) by the igstats Neon Function
// (automations/instagram-stats). Public read-only endpoint: no key needed.
const INSTAGRAM_STATS_URL =
  process.env.INSTAGRAM_STATS_URL ??
  "https://br-steep-resonance-b1bwn48v-igstats.compute.c-5.eu-central-1.aws.neon.tech/public/instagram";

export const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

// Returns undefined on any failure so the page falls back to the value in data/links.ts
export async function getInstagramFollowers(): Promise<number | undefined> {
  try {
    const res = await fetch(INSTAGRAM_STATS_URL, {
      next: { revalidate: ONE_DAY_IN_SECONDS },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return undefined;
    const { followers } = await res.json();
    return typeof followers === "number" ? followers : undefined;
  } catch {
    return undefined;
  }
}
