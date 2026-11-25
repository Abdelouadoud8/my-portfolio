"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ui, type Locale } from "@/lib/i18n";

type OfferCountdownProps = {
  // The session's offerEndsAt (fixed deadline): nothing shows once it has passed
  endsAt?: string;
  // Training page: "تخفيض ينتهي بعد 2 يوم 10 ساعة 5 دقيقة" (days, hours, minutes); /links keeps the short one
  detailed?: boolean;
  locale?: Locale;
  className?: string;
};

// Small red chip "ينتهي بعد 3 يوم 9 ساعة": days and hours left before a session's offer ends. Rendered only in the
// browser, refreshed every minute (the pages are static: the server can't know the visitor's time) and gone once the deadline has passed.
export default function OfferCountdown({ endsAt, detailed = false, locale = "ar", className }: OfferCountdownProps) {
  const t = ui[locale];
  const end = endsAt ? Date.parse(endsAt) : NaN;
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (Number.isNaN(end)) return;
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(timer);
  }, [end]);

  if (now === null || Number.isNaN(end) || end <= now) return null;

  // Detailed: minutes rounded up; short: hours rounded up (no minutes shown)
  const minutesLeft = Math.ceil((end - now) / 60_000);
  const hoursLeft = detailed ? Math.floor(minutesLeft / 60) : Math.ceil(minutesLeft / 60);
  const days = Math.floor(hoursLeft / 24);
  const hours = hoursLeft % 24;
  const minutes = minutesLeft % 60;

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-600",
        className,
      )}
    >
      <span className="size-1.5 shrink-0 animate-pulse rounded-full bg-red-600" aria-hidden />
      {detailed ? t.discountEndsIn : t.offerEndsIn} {days > 0 && `${days} ${t.countdownUnits.d} `}
      {hours} {t.countdownUnits.h}
      {detailed && ` ${minutes} ${t.countdownUnits.m}`}
    </span>
  );
}
