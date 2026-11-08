import Link from "next/link";
import { Training, TrainingSession } from "@/data/types";
import { EVENTS, eventAttributes } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { discountPercent, isFull, nextSession } from "@/lib/trainings";
import { localeMeta, localePath, ui, type Locale } from "@/lib/i18n";
import { IconGraduationCap } from "@/components/shared/icons/icon-graduation-cap";
import { IconCalendar } from "@/components/shared/icons/icon-calendar";
import { IconClock } from "@/components/shared/icons/icon-clock";
import { IconVideoCamera } from "@/components/shared/icons/icon-video-camera";
import { IconUsers } from "@/components/shared/icons/icon-users";

// Offer card on /links: badges, title, the next session (date, place, places left), price with the old one struck
// through, and one button to the details page. `sessions` already carry the bot's live seats (lib/trainings).
export default function TrainingCard({
  training,
  sessions,
  locale = "ar",
}: {
  training: Training;
  sessions: TrainingSession[];
  // Text already localized (lib/localize); only the interface text comes from here
  locale?: Locale;
}) {
  const t = ui[locale];
  const { id, title, description, platform, price } = training;
  const session = nextSession(training, sessions);
  const discount = session && discountPercent(session);
  const full = !session || isFull(session);

  // 2×2: date | time, place | places left
  const details = [
    session && { key: "date", Icon: IconCalendar, text: session.date },
    session?.time && { key: "time", Icon: IconClock, text: session.time, ltr: true },
    platform && { key: "platform", Icon: IconVideoCamera, text: platform },
    session && {
      key: "seats",
      Icon: IconUsers,
      text: full ? t.full : t.seatsLeft(session.seatsLeft, session.seats),
      strong: !full,
    },
  ].filter(Boolean) as {
    key: string;
    Icon: typeof IconCalendar;
    text: string;
    ltr?: boolean;
    strong?: boolean;
  }[];

  return (
    <article
      dir={localeMeta[locale].dir}
      className="flex flex-col gap-4 rounded-2xl border border-primary/30 bg-white p-5 shadow-[0_6px_20px_color-mix(in_srgb,var(--color-primary)_10%,transparent)]"
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-white">
          {t.links.liveBadge}
        </span>
        {discount ? (
          <span dir="ltr" className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-bold text-primary">
            -{discount}%
          </span>
        ) : null}
        <span className="rounded-full bg-neutral-5 px-2.5 py-0.5 text-xs font-medium text-neutral-70">
          {t.links.beginners}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
          <IconGraduationCap width={26} height={26} />
        </span>
        <h3 dir="auto" className="text-start text-lg font-bold leading-7 text-neutral-100">
          {title}
        </h3>
      </div>

      {description && (
        <p dir="auto" className="text-start text-sm leading-6 text-neutral-70">
          {description}
        </p>
      )}

      {details.length > 0 && (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-neutral-70">
          {details.map(({ key, Icon, text, ltr, strong }) => (
            <li key={key} className="flex min-w-0 items-center gap-2">
              <Icon width={18} height={18} className="shrink-0 text-primary" />
              {/* The time is isolated LTR: "20:00 - 22:00" would read 22:00 first in RTL */}
              {ltr ? (
                <bdi dir="ltr">{text}</bdi>
              ) : (
                <span
                  dir="auto"
                  className={cn(key !== "date" && "truncate", strong && "font-bold text-neutral-100")}
                >
                  {text}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-between gap-3 border-t border-neutral-20 pt-4">
        <div className="flex flex-col">
          <span className="text-xs text-neutral-70">{t.links.sessionPrice}</span>
          <span className="flex items-baseline gap-2">
            <span dir="ltr" className="whitespace-nowrap text-xl font-bold text-primary">
              {session?.price ?? price}
            </span>
            {session?.oldPrice && (
              <s dir="ltr" className="whitespace-nowrap text-sm text-neutral-70">
                <span className="sr-only">{t.insteadOf}</span>
                {session.oldPrice}
              </s>
            )}
          </span>
        </div>
        <Link
          prefetch={false}
          href={localePath(locale, `/trainings/${id}`)}
          className="flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-primary px-5 font-semibold text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-primary-600"
          {...eventAttributes(EVENTS.trainingDetailsClick, { training: id, location: "links" })}
        >
          {t.links.courseDetails}
        </Link>
      </div>
    </article>
  );
}
