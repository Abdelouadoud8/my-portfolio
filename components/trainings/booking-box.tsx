import type { Training, TrainingSession } from "@/data/types";
import { EVENTS, eventAttributes } from "@/lib/analytics";
import { cn, formatCompact } from "@/lib/utils";
import { discountPercent, isFull, sessionSignupHref } from "@/lib/trainings";
import { localeMeta, ui, type Locale } from "@/lib/i18n";
import { IconCalendar } from "@/components/shared/icons/icon-calendar";
import { IconUsers } from "@/components/shared/icons/icon-users";

type BookingBoxProps = {
  training: Pick<Training, "id" | "telegramBot" | "signupHref">;
  // The session to push (lib/trainings nextSession); the box is hidden without one
  session?: TrainingSession;
  // Sum of the followers on every platform (social proof under the box)
  totalFollowers?: number;
  locale?: Locale;
};

// Price + places box under the hero (one clear action, then a line that removes the doubt), followed by the social
// proof. Same booking rules as the session cards.
export default function BookingBox({ training, session, totalFollowers, locale = "ar" }: BookingBoxProps) {
  if (!session) return null;
  const t = ui[locale];
  const rtl = localeMeta[locale].dir === "rtl";
  const href = sessionSignupHref(training, session);
  const discount = discountPercent(session);
  const full = isFull(session);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-4 rounded-2xl border border-primary/30 bg-white p-4 shadow-[0_6px_20px_color-mix(in_srgb,var(--color-primary)_10%,transparent)] sm:p-5">
        <div
          className={cn(
            "grid grid-cols-[minmax(0,1fr)_auto] divide-x divide-neutral-20",
            rtl && "divide-x-reverse",
          )}
        >
          <div className="flex flex-col gap-1 pe-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-70">{t.price}</span>
              {discount && (
                <span dir="ltr" className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-white">
                  -{discount}%
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span dir="ltr" className="text-2xl font-bold text-primary">
                {session.price}
              </span>
              {session.oldPrice && (
                <s dir="ltr" className="text-sm text-neutral-70">
                  <span className="sr-only">{t.insteadOf}</span>
                  {session.oldPrice}
                </s>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1 ps-4">
            <span className="text-xs font-bold text-neutral-70">{t.training.seats}</span>
            <span
              className={cn(
                "flex items-baseline gap-1.5 text-2xl font-bold",
                full ? "text-neutral-70" : "text-neutral-100",
              )}
            >
              {full ? t.full : session.seatsLeft}
              {!full && <span className="text-sm font-medium text-neutral-70">{t.training.left}</span>}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-neutral-70">
          <IconCalendar width={18} height={18} className="shrink-0 text-primary" />
          <span>
            {t.nextSession}: <span className="font-semibold text-neutral-100">{session.date}</span>
            {session.time && (
              <>
                {" · "}
                <bdi dir="ltr">{session.time}</bdi>
              </>
            )}
          </span>
        </div>

        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 w-full items-center justify-center rounded-lg bg-primary px-4 font-semibold text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            {...eventAttributes(EVENTS.trainingSignupClick, { training: training.id, location: "hero" })}
          >
            {t.training.bookCta}
          </a>
        ) : (
          <span
            aria-disabled="true"
            className="flex min-h-12 w-full cursor-default items-center justify-center rounded-lg bg-neutral-10 px-4 font-semibold text-neutral-70"
          >
            {t.bookingSoon}
          </span>
        )}

        <p className="text-center text-xs leading-5 text-neutral-70">{t.training.reassurance}</p>
      </div>

      {totalFollowers ? (
        <div className="flex items-center justify-center gap-2 text-sm text-neutral-70">
          <IconUsers width={18} height={18} className="shrink-0 text-primary" />
          <span>
            <bdi dir="ltr" className="font-bold text-neutral-100">
              +{formatCompact(totalFollowers)}
            </bdi>{" "}
            {t.training.followersLine}
          </span>
        </div>
      ) : null}
    </div>
  );
}
