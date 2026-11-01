import type { TrainingSession } from "@/data/types";
import { EVENTS, eventAttributes } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { IconCalendar } from "@/components/shared/icons/icon-calendar";
import { IconUsers } from "@/components/shared/icons/icon-users";
import { IconCheckCircle } from "@/components/shared/icons/icon-check-circle";
import { IconClock } from "@/components/shared/icons/icon-clock";
import { IconTag } from "@/components/shared/icons/icon-tag";

type SessionCardsProps = {
  trainingId: string;
  sessions: TrainingSession[];
  // Used when a session has no signupHref of its own
  signupHref?: string;
  // Registration bot username: open sessions (bookingOpen) link to t.me/<bot>?start=<trainingId>_<sessionId>
  telegramBot?: string;
  // Length of one session, e.g. "ساعتين" (the training's `time`)
  duration?: string;
  // "horizontal": one wide card per row (all on one line from sm up), "vertical": cards side by side
  variant?: "horizontal" | "vertical";
};

// At or under this many places left, "available places" turns into a red "only N left" warning
const FEW_SEATS = 5;

// "الحصص" section of the training page: date, details (participants, places left, duration, price), price tag,
// register button; badges on the top edge for the next session and the discount.
// Shown in data order (keep `sessions` sorted by date); the first open one gets the filled button and border, full ones are muted.
export default function SessionCards({
  trainingId,
  sessions,
  signupHref,
  telegramBot,
  duration,
  variant = "horizontal",
}: SessionCardsProps) {
  const nextDate = sessions.find((s) => !isFull(s))?.date;
  const hrefOf = (session: TrainingSession) => {
    if (isFull(session)) return undefined;
    if (session.signupHref) return session.signupHref;
    if (session.bookingOpen && telegramBot)
      return `https://t.me/${telegramBot}?start=${trainingId}_${session.id}`;
    return signupHref;
  };
  // Keep the button column in every card as soon as one card has a button, so the cards stay aligned
  const anyButton = sessions.some(hrefOf);

  const cards = sessions.map((session, index) => {
    const full = isFull(session);
    const next = session.date === nextDate;
    const discount = full ? undefined : discountPercent(session);
    const href = hrefOf(session);
    // The button only exists while booking is open; otherwise the status is a badge on the top edge
    const button = href && (
      <RegisterButton href={href} trainingId={trainingId} location={`session-${index + 1}`} emphasis={next} />
    );
    // Phones only: a greyed "تسجيل" while booking isn't open yet (desktop shows just the badge)
    const soonButton = !full && !href && (
      <span
        aria-disabled="true"
        className="flex min-h-11 w-full cursor-default items-center justify-center rounded-lg bg-neutral-10 px-3 py-3 text-sm font-semibold text-neutral-60 sm:hidden"
      >
        تسجيل
      </span>
    );
    return (
      <article
        key={session.id}
        aria-label={session.date}
        className={cn(
          "relative rounded-xl border bg-white p-4",
          variant === "vertical"
            ? "flex w-[78%] shrink-0 snap-start flex-col gap-4 sm:w-auto"
            : // sm+: info zone (date, then the four details in one row) | divider | button (same width in every card)
              "flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5",
          next
            ? "border-primary shadow-[0_6px_20px_color-mix(in_srgb,var(--color-primary)_12%,transparent)]"
            : "border-neutral-20",
          full && "bg-neutral-5",
        )}
      >
        <div className="absolute -top-3 start-4 flex gap-1.5">
          {full ? (
            <Badge muted>مكتملة</Badge>
          ) : (
            <>
              {discount && (
                <Badge>
                  <span dir="ltr">-{discount}%</span>
                </Badge>
              )}
              {!href && <Badge outline>التسجيل يتفتح قريبا</Badge>}
            </>
          )}
        </div>
        {variant === "horizontal" ? (
          <>
            <div className="flex min-w-0 flex-1 flex-col gap-4 sm:gap-3">
              <SessionDate session={session} />
              <Details session={session} duration={duration} row />
            </div>
            {(anyButton || soonButton) && (
              <div
                className={cn(
                  // sm+: empty (but same width) in cards without a button, so the details still line up
                  "sm:w-32 sm:shrink-0 sm:self-stretch sm:items-center sm:ps-5",
                  anyButton ? "sm:flex" : "sm:hidden",
                  button ? "sm:border-s sm:border-neutral-20" : !soonButton && "hidden",
                )}
              >
                {button || soonButton}
              </div>
            )}
          </>
        ) : (
          <>
            <SessionDate session={session} />
            <Details session={session} duration={duration} />
            {(button || soonButton) && <div className="mt-auto">{button || soonButton}</div>}
          </>
        )}
      </article>
    );
  });

  if (variant === "horizontal") return <div className="flex flex-col gap-8 pt-3">{cards}</div>;

  return (
    // Phones: horizontal swipe with the next card peeking; sm+: one column per session.
    // pt-3 leaves room for the badges that sits on the card's top edge.
    <div className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 pt-3 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0">
      {cards}
    </div>
  );
}

function isFull(session: TrainingSession) {
  return session.seatsLeft <= 0;
}

// "2000 DA" + "1500 DA" → 25 (whole percent), undefined when either isn't a number
function discountPercent(session: TrainingSession) {
  const toNumber = (value?: string) => Number(value?.replace(/[^\d.]/g, "") || NaN);
  const before = toNumber(session.oldPrice);
  const now = toNumber(session.price);
  if (!before || !now || now >= before) return undefined;
  return Math.round(((before - now) / before) * 100);
}

function SessionDate({ session }: { session: TrainingSession }) {
  return (
    <div className="flex min-w-0 items-start gap-2">
      <IconCalendar width={20} height={20} aria-hidden className="mt-0.5 shrink-0 text-primary" />
      <div className="min-w-0">
        <h3 dir="auto" className="whitespace-nowrap text-start font-bold text-neutral-100">
          {session.date}
        </h3>
        {session.time && (
          // "20:00 - 22:00" would read right-to-left (22:00 first) without the LTR isolate
          <p className="text-start text-sm text-neutral-70">
            <bdi dir="ltr">{session.time}</bdi>
          </p>
        )}
      </div>
    </div>
  );
}

// Pill on the card's top edge. muted: full session; outline: booking not open yet
function Badge({
  children,
  muted = false,
  outline = false,
}: {
  children: React.ReactNode;
  muted?: boolean;
  outline?: boolean;
}) {
  return (
    <span
      className={cn(
        "rounded-full border px-2.5 py-0.5 text-xs font-bold",
        muted
          ? "border-neutral-30 bg-neutral-10 text-neutral-70"
          : outline
            ? "border-primary bg-white text-primary"
            : "border-primary bg-primary text-white",
      )}
    >
      {children}
    </span>
  );
}

// Details with an icon each: participants, places left, duration, price.
// 2×2 grid; row: one line from md up, fixed columns so every card lines up
function Details({
  session,
  duration,
  row = false,
}: {
  session: TrainingSession;
  duration?: string;
  row?: boolean;
}) {
  const full = isFull(session);
  const few = !full && session.seatsLeft <= FEW_SEATS;
  const items = [
    { Icon: IconUsers, text: `${session.seats} مشارك` },
    {
      Icon: IconCheckCircle,
      text: full
        ? "مكتملة"
        : few
          ? `غير ${session.seatsLeft} بلايص باقيين!`
          : `باقي ${session.seatsLeft} بلاصة`,
      className: full ? "text-neutral-70" : few ? "font-bold text-primary" : undefined,
    },
    ...(duration ? [{ Icon: IconClock, text: duration }] : []),
    { Icon: IconTag, text: session.price, ltr: true, oldPrice: session.oldPrice },
  ];
  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-neutral-100",
        row && "md:grid-cols-[5.25rem_6.5rem_4.5rem_minmax(0,1fr)] md:gap-x-3",
      )}
    >
      {items.map(({ Icon, text, className, ltr, oldPrice }) => (
        <li key={text} className={cn("flex min-w-0 items-center gap-2", className)}>
          <Icon width={18} height={18} aria-hidden className="shrink-0 text-primary" />
          <span
            dir={ltr ? "ltr" : undefined}
            className={cn("truncate", oldPrice && "font-bold text-primary")}
          >
            {text}
          </span>
          {/* Price: the old price struck through next to the new one */}
          {oldPrice && (
            <s dir="ltr" className="shrink-0 text-xs text-neutral-70">
              <span className="sr-only">بدل </span>
              {oldPrice}
            </s>
          )}
        </li>
      ))}
    </ul>
  );
}

function RegisterButton({
  href,
  trainingId,
  location,
  emphasis,
}: {
  href: string;
  trainingId: string;
  location: string;
  // The next session gets the filled button, the later ones an outlined one
  emphasis: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex min-h-11 w-full items-center justify-center rounded-lg px-3 py-3 text-sm font-semibold transition-all duration-200 ease-out hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        emphasis
          ? "bg-primary text-white hover:bg-primary-600"
          : "border border-primary text-primary hover:bg-primary-50",
      )}
      {...eventAttributes(EVENTS.trainingSignupClick, { training: trainingId, location })}
    >
      تسجيل
    </a>
  );
}
