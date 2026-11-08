"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ui, type Locale } from "@/lib/i18n";

export type NavSection = { id: string; label: string };

type SectionNavProps = {
  sections: NavSection[];
  // "side": sticky list next to the content (desktop), "bar": sticky row of chips on top (phone)
  variant: "side" | "bar";
  locale?: Locale;
};

// Training details page: jump to a section; the section being read is highlighted
export default function SectionNav({ sections, variant, locale = "ar" }: SectionNavProps) {
  const t = ui[locale];
  const [active, setActive] = useState(sections[0]?.id);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const targets = sections
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    // A section counts as "being read" when it crosses the upper third of the screen
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    targets.forEach((el) => observer.observe(el));

    // The last sections can't scroll up to that band: at the bottom of the page, highlight the last one
    const onScroll = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
      if (atBottom && targets.length > 0) setActive(targets[targets.length - 1].id);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [sections]);

  // Phone bar: keep the active chip visible (horizontal scroll only, never moves the page)
  useEffect(() => {
    const bar = barRef.current;
    const chip = bar?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!bar || !chip) return;
    const left = chip.offsetLeft - (bar.clientWidth - chip.offsetWidth) / 2;
    bar.scrollTo({ left, behavior: "smooth" });
  }, [active]);

  const jump = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    history.replaceState(null, "", `#${id}`);
    setActive(id);
  };

  if (variant === "bar") {
    return (
      <nav
        aria-label={t.pageSections}
        className="sticky top-0 z-10 -mx-4 border-b border-neutral-20 bg-white/90 backdrop-blur lg:hidden"
      >
        <div ref={barRef} className="flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none]">
          {sections.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              data-id={id}
              onClick={(e) => jump(e, id)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                active === id ? "bg-primary text-white" : "bg-neutral-5 text-neutral-70 hover:text-primary",
              )}
            >
              {label}
            </a>
          ))}
        </div>
      </nav>
    );
  }

  return (
    <nav aria-label={t.pageSections} className="sticky top-8 hidden lg:block">
      <p className="mb-3 text-xs font-bold text-primary">{t.onThisPage}</p>
      <ul className="flex flex-col border-s border-neutral-20">
        {sections.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={(e) => jump(e, id)}
              className={cn(
                "-ms-px block border-s-2 py-2 ps-4 text-sm transition-colors",
                active === id
                  ? "border-primary font-bold text-primary"
                  : "border-transparent text-neutral-70 hover:text-neutral-100",
              )}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
