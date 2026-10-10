import type { SocialLink, SocialPlatform } from "@/data/types";

// Live follower counts, saved every day at 23:59 (Paris) by the Neon Functions in automations/
// (igstats for Instagram, fbstats for Facebook). Public read-only endpoints: no key needed.
// Each platform is fetched independently: if one fails, the others still show their live count.
const LIVE_FOLLOWERS_URLS: Partial<Record<SocialPlatform, string>> = {
  instagram:
    process.env.INSTAGRAM_STATS_URL ??
    "https://br-steep-resonance-b1bwn48v-igstats.compute.c-5.eu-central-1.aws.neon.tech/public/instagram",
  facebook:
    process.env.FACEBOOK_STATS_URL ??
    "https://br-steep-resonance-b1bwn48v-fbstats.compute.c-5.eu-central-1.aws.neon.tech/public/facebook",
};

export const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

// The visible social links (hidden ones removed) with live daily counts, for /links and /blog
export async function getVisibleSocials(socials: SocialLink[]) {
  const platforms = Object.keys(LIVE_FOLLOWERS_URLS) as SocialPlatform[];
  const counts = await Promise.all(platforms.map((platform) => getLiveFollowers(platform)));
  const live = Object.fromEntries(platforms.map((platform, i) => [platform, counts[i]]));

  return socials
    .filter((link) => link.comingSoon || link.href)
    .map((link) => (live[link.platform] ? { ...link, followers: live[link.platform] } : link));
}

export function getInstagramFollowers() {
  return getLiveFollowers("instagram");
}

// Returns undefined on any failure so the page falls back to the value in data/links.ts
export async function getLiveFollowers(platform: SocialPlatform): Promise<number | undefined> {
  const url = LIVE_FOLLOWERS_URLS[platform];
  if (!url) return undefined;
  try {
    // Next's data cache outlives deployments: keying it by commit makes every deploy fetch the
    // current count, then the daily revalidation applies until the next deploy
    const cacheKey = process.env.VERCEL_GIT_COMMIT_SHA ?? "local";
    const res = await fetch(`${url}?deploy=${cacheKey}`, {
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
