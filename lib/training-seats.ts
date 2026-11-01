// Live seats left per session, from the registration bot (automations/training-bot, Neon Function "trainbot"):
// paid + receipts under review + seats held while people pay. Public read-only endpoint, no key needed.
const TRAINING_BOT_URL =
  process.env.TRAINING_BOT_URL ??
  "https://br-steep-resonance-b1bwn48v-trainbot.compute.c-5.eu-central-1.aws.neon.tech";

// Seats move during registrations: refresh every 5 minutes (only on visits, like the follower counts)
export const SEATS_CACHE_SECONDS = 300;

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
