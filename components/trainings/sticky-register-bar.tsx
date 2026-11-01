"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type StickyRegisterBarProps = {
  // Next session that still has places
  date: string;
  time?: string;
  price: string;
  oldPrice?: string;
  // id of the sessions section: the button scrolls there, and the bar hides while it is on screen
  targetId: string;
};

// Bottom bar on phones and desktop: next date + price + "تسجيل". Shows once the visitor has scrolled past the top,
// hides while the sessions (which have their own buttons) are visible.
export default function StickyRegisterBar({ date, time, price, oldPrice, targetId }: StickyRegisterBarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [targetVisible, setTargetVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const target = document.getElementById(targetId);
    const observer = new IntersectionObserver(([entry]) => setTargetVisible(entry.isIntersecting));
    if (target) observer.observe(target);

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [targetId]);

  const visible = scrolled && !targetVisible;

  const goToSessions = () => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-20 border-t border-neutral-20 bg-white/95 backdrop-blur transition-transform duration-300 ease-out motion-reduce:transition-none",
        visible ? "translate-y-0" : "pointer-events-none translate-y-full",
      )}
    >
      {/* Same grid as the page (side nav column + content) so the bar lines up with the content on desktop */}
      <div className="mx-auto w-full max-w-2xl px-4 lg:grid lg:max-w-5xl lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-16">
        <div className="hidden lg:block" />
        <div className="flex max-w-2xl items-center justify-between gap-4 py-3">
          <div className="flex min-w-0 flex-col">
            <div className="flex items-baseline gap-2">
              <span dir="ltr" className="text-lg font-bold text-primary">
                {price}
              </span>
              {oldPrice && (
                <s dir="ltr" className="text-sm text-neutral-70">
                  <span className="sr-only">بدل </span>
                  {oldPrice}
                </s>
              )}
            </div>
            <p className="whitespace-nowrap text-xs text-neutral-70">
              <span className="hidden sm:inline">الحصة الجاية: </span>
              {date}
              {time && (
                <>
                  {" · "}
                  <bdi dir="ltr">{time}</bdi>
                </>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={goToSessions}
            tabIndex={visible ? 0 : -1}
            className="min-h-11 shrink-0 cursor-pointer rounded-lg bg-primary px-8 text-sm font-semibold text-white transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            تسجيل
          </button>
        </div>
      </div>
    </div>
  );
}
