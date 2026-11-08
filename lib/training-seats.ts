// Live seats left per session, from the registration bot (automations/training-bot, Neon Function "trainbot"):
// paid + receipts under review + seats held while people pay. Public read-only endpoint, no key needed.
const TRAINING_BOT_URL =
  process.env.TRAINING_BOT_URL ??
  "https://br-steep-resonance-b1bwn48v-trainbot.compute.c-5.eu-central-1.aws.neon.tech";

// Live seats refresh every 6 hours (only on visits, like the follower counts). Each refresh rebuilds the pages that
// show seats (/links + the training page, in 3 languages), so a long interval keeps Vercel usage low.
export const SEATS_CACHE_SECONDS = 21600;

// { "<trainingId>_<sessionId>": seatsLeft }, or undefined on any failure (the page keeps the data file's values)
export async function getLiveSeats(trainingId: string): Promise<Record<string, number> | undefined> {
  try {
    const res = await fetch(`${TRAINING_BOT_URL}/public/seats/${encodeURIComponent(trainingId)}`, {
      next: { revalidate: SEATS_CACHE_SECONDS },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return undefined;
    const { seatsLeft } = (await res.json()) as { seatsLeft?: Record<string, number> };
    return seatsLeft && typeof seatsLeft === "object" ? seatsLeft : undefined;
  } catch {
    return undefined;
  }
}
