import type { Training, TrainingSession } from "@/data/types";
import { getLiveSeats } from "@/lib/training-seats";

// Booking logic shared by the /links training card, the details page's price box and the session cards

// Visible sessions (not `hidden`) with the bot's live seats left once the registration bot is set, else the data
// file's values
export async function withLiveSeats(training: Training): Promise<TrainingSession[]> {
  const sessions = (training.sessions ?? []).filter((session) => !session.hidden);
  const live = training.telegramBot ? await getLiveSeats(training.id) : undefined;
  return sessions.map((session) => ({
    ...session,
    // displaySeatsLeft (fixed number for the website) > the bot's live count > the data file's seatsLeft
    seatsLeft: session.displaySeatsLeft ?? live?.[`${training.id}_${session.id}`] ?? session.seatsLeft,
  }));
}

export function isFull(session: TrainingSession) {
  return session.seatsLeft <= 0;
}

// Where "تسجيل" goes for a session, or undefined while booking isn't open (or it's full):
// the session's own link, else the Telegram bot for bookingOpen sessions, else the training's link
export function sessionSignupHref(
  training: Pick<Training, "id" | "telegramBot" | "signupHref">,
  session: TrainingSession,
) {
  if (isFull(session)) return undefined;
  if (session.signupHref) return session.signupHref;
  if (session.bookingOpen && training.telegramBot) {
    return `https://t.me/${training.telegramBot}?start=${training.id}_${session.id}`;
  }
  return training.signupHref;
}

// The session to push: the first one people can book now, else the first one that still has places
export function nextSession(
  training: Pick<Training, "id" | "telegramBot" | "signupHref">,
  sessions: TrainingSession[],
) {
  return (
    sessions.find((session) => sessionSignupHref(training, session)) ??
    sessions.find((session) => !isFull(session))
  );
}

// "3000 DA" + "1500 DA" → 50 (whole percent), undefined when either isn't a number or there's no discount
export function discountPercent(session: Pick<TrainingSession, "price" | "oldPrice">) {
  const toNumber = (value?: string) => Number(value?.replace(/[^\d.]/g, "") || NaN);
  const before = toNumber(session.oldPrice);
  const now = toNumber(session.price);
  if (!before || !now || now >= before) return undefined;
  return Math.round(((before - now) / before) * 100);
}
