import Image from "next/image";
import Link from "next/link";
import { linksProfile } from "@/data/links/links";
import { services } from "@/data/services/services";
import { LOCALES, localeMeta, localePath, ui, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export type HeaderPage = "links" | "training" | "one-to-one" | "business";

type SiteHeaderProps = {
  locale: Locale;
  // The same page in each language (language switcher)
  paths: Record<Locale, string>;
  // Page being shown (highlighted in the menu)
  active: HeaderPage;
  // Main training (/trainings/<id>)
  trainingId?: string;
};

// Header of /links and its pages: name (→ /links), the three offers, language switcher. Not sticky: the training
// and service pages already have a sticky section bar on phones. Phones: offers on a second scrollable row.
export default function SiteHeader({ locale, paths, active, trainingId }: SiteHeaderProps) {
  const t = ui[locale].header;
  const items = [
    trainingId && { id: "training", label: t.training, href: `/trainings/${trainingId}` },
    { id: "one-to-one", label: t.oneToOne, href: "/services/one-to-one" },
    { id: "business", label: t.business, href: "/services/business" },
  ]
    // Services marked `unlisted` in data/services/services.ts stay out of the menu
    .filter((item) => item && !services.find((service) => service.id === item.id)?.unlisted)
    .filter(Boolean) as { id: HeaderPage; label: string; href: string }[];

  const nav = (className: string) => (
    <nav aria-label={t.menu} className={className}>
      {items.map((item) => (
        <Link
          prefetch={false}
          key={item.id}
          href={localePath(locale, item.href)}
          aria-current={active === item.id ? "page" : undefined}
          className={cn(
            "shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
            active === item.id
              ? "bg-primary text-white"
              : "text-neutral-70 hover:bg-primary-50 hover:text-primary",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <header
      dir={localeMeta[locale].dir}
      className={cn("border-b border-neutral-20 bg-white/80 backdrop-blur", locale === "ar" && "font-arabic")}
    >
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link
          prefetch={false}
          href={localePath(locale, "/links")}
          aria-label={t.home}
          className="flex min-w-0 items-center gap-2.5 font-semibold text-neutral-100"
        >
          <Image
            src={linksProfile.imageUrl}
            unoptimized
            alt=""
            width={36}
            height={36}
            className="size-9 shrink-0 rounded-full object-cover ring-2 ring-primary/20"
          />
          <span className="truncate text-sm">
            <bdi>{ui[locale].trainerName}</bdi>
          </span>
        </Link>

        {nav("hidden items-center gap-1 md:flex")}

        {/* Language switcher: same page in the other languages */}
        <div
          role="group"
          aria-label={t.language}
          className="flex shrink-0 items-center rounded-full border border-neutral-20 p-0.5 text-xs font-semibold"
        >
          {LOCALES.map((code) => (
            <Link
              prefetch={false}
              key={code}
              href={paths[code]}
              hrefLang={localeMeta[code].lang}
              lang={localeMeta[code].lang}
              aria-current={code === locale ? "true" : undefined}
              title={localeMeta[code].name}
              className={cn(
                "rounded-full px-2.5 py-1 transition-colors",
                code === "ar" && "font-arabic",
                code === locale ? "bg-primary text-white" : "text-neutral-70 hover:text-primary",
              )}
            >
              {code === "ar" ? "دارجة" : code.toUpperCase()}
            </Link>
          ))}
        </div>
      </div>
      {nav("flex gap-1 overflow-x-auto px-4 pb-3 [scrollbar-width:none] md:hidden")}
    </header>
  );
}
