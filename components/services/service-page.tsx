import type { Metadata } from "next";
import { sitePreviewImage } from "@/lib/link-preview";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconUser } from "@/components/shared/icons/icon-user";
import { IconBuildings } from "@/components/shared/icons/icon-buildings";
import { IconCheckCircle } from "@/components/shared/icons/icon-check-circle";
import { IconXCircle } from "@/components/shared/icons/icon-x-circle";
import { IconClock } from "@/components/shared/icons/icon-clock";
import { IconVideoCamera } from "@/components/shared/icons/icon-video-camera";
import { IconFileText } from "@/components/shared/icons/icon-file-text";
import { IconTag } from "@/components/shared/icons/icon-tag";
import type { ServiceFact } from "@/data/types";
import { services } from "@/data/services/services";
import { linksProfile } from "@/data/links/links";
import { EVENTS, eventAttributes } from "@/lib/analytics";
import { IconTelegram } from "@/components/shared/icons/icon-telegram";
import SectionNav, { type NavSection } from "@/components/trainings/section-nav";
import SiteHeader, { type HeaderPage } from "@/components/links/site-header";
import { trainings } from "@/data/trainings/trainings";
import { localizeService } from "@/lib/localize";
import { languageAlternates, localeMeta, localePath, localePaths, ui, type Locale } from "@/lib/i18n";

// Metadata of /services/<id> in one language (Darja, /en/…, /fr/…)
export function serviceMetadata(id: string, locale: Locale): Metadata {
  const base = services.find((s) => s.id === id);
  if (!base) return {};
  const service = localizeService(base, locale);
  return {
    title: service.cardTitle,
    description: service.cardDescription,
    alternates: languageAlternates(`/services/${id}`),
    // Full openGraph block: a page's openGraph replaces the layout's one (not merged), so the small preview image
    // must be repeated here or Meta picks a random image from the page
    openGraph: {
      siteName: "Abdelouadoud's Portfolio",
      images: [sitePreviewImage],
      type: "website",
      locale: localeMeta[locale].ogLocale,
    },
  };
}

// Same Phosphor duotone set as the training page
const serviceIcons: Record<string, typeof IconUser> = {
  "one-to-one": IconUser,
  business: IconBuildings,
};

const factIcons: Record<NonNullable<ServiceFact["icon"]>, typeof IconUser> = {
  clock: IconClock,
  video: IconVideoCamera,
  user: IconUser,
  file: IconFileText,
  tag: IconTag,
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-bold text-neutral-100">{children}</h2>;
}

const sectionClass = "flex scroll-mt-20 flex-col gap-4 lg:scroll-mt-8";

// 1:1 call / business automation page in one language, modelled on the training page (violet, section nav on the
// side). One action everywhere: the request button (Telegram), you pay only once the request is accepted.
export default function ServicePageContent({ id, locale }: { id: string; locale: Locale }) {
  const base = services.find((s) => s.id === id);
  if (!base) notFound();
  const service = localizeService(base, locale);
  const t = ui[locale];
  const ts = t.services;
  const { dir } = localeMeta[locale];

  const {
    badge,
    title,
    description,
    price,
    priceNote,
    facts = [],
    includedTitle = "",
    included = [],
    steps = [],
    forWho = [],
    notFor = [],
    honestNote,
    faq = [],
    requestLabel,
    requestHref,
    secondary,
  } = service;
  const Icon = serviceIcons[id] ?? IconUser;

  const sections = [
    { id: "included", label: includedTitle, show: included.length > 0 },
    { id: "steps", label: ts.steps, show: steps.length > 0 },
    { id: "for-who", label: ts.forWho, show: forWho.length > 0 || notFor.length > 0 },
    { id: "who", label: ts.whoAmI, show: true },
    { id: "faq", label: t.faq, show: faq.length > 0 },
  ]
    .filter((section) => section.show)
    .map(({ id, label }): NavSection => ({ id, label }));

  const requestButton = (location: string, className = "") => (
    <a
      href={requestHref}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-5 font-semibold text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${className}`}
      {...eventAttributes(EVENTS.serviceRequestClick, { service: id, location })}
    >
      <IconTelegram width={20} height={20} />
      {requestLabel}
    </a>
  );

  return (
    <div
      dir={dir}
      lang={localeMeta[locale].lang}
      className={`${locale === "ar" ? "font-arabic" : ""} bg-[radial-gradient(70%_30%_at_50%_0%,color-mix(in_srgb,var(--color-primary)_8%,transparent),transparent)]`}
    >
      <SiteHeader
        locale={locale}
        paths={localePaths(`/services/${id}`)}
        active={id as HeaderPage}
        trainingId={trainings[0]?.id}
      />
      <div className="mx-auto w-full max-w-2xl px-4 pb-16 pt-8 animate-in fade-in slide-in-from-bottom-2 duration-500 lg:grid lg:max-w-5xl lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-16">
        <aside className="hidden lg:block">
          <SectionNav sections={sections} variant="side" locale={locale} />
        </aside>

        <div className="flex min-w-0 max-w-2xl flex-col gap-12">
          <Link
            prefetch={false}
            href={localePath(locale, "/links")}
            className="self-start text-sm font-medium text-neutral-70 transition-colors hover:text-primary"
          >
            {dir === "rtl" ? "→" : "←"} {t.backToLinks}
          </Link>

          <header className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
                <Icon width={28} height={28} />
              </span>
              <span
                dir="auto"
                className="rounded-full bg-primary-50 px-3 py-1 text-sm font-bold text-primary"
              >
                {badge}
              </span>
            </div>
            <h1 className="text-3xl font-bold leading-[1.4] text-neutral-100">{title}</h1>
            <p className="text-base leading-8 text-neutral-70">{description}</p>
          </header>

          {/* Price + the one action */}
          <div className="flex flex-col gap-4 rounded-2xl border border-primary/30 bg-white p-4 shadow-[0_6px_20px_color-mix(in_srgb,var(--color-primary)_10%,transparent)] sm:p-5">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-neutral-70">{t.price}</span>
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span dir="auto" className="text-2xl font-bold text-primary">
                  {price}
                </span>
                {priceNote && <span className="text-sm text-neutral-70">{priceNote}</span>}
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              {requestButton("hero", "w-full sm:flex-1")}
              {secondary && (
                <a
                  href={secondary.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-12 items-center justify-center rounded-lg border border-primary px-5 font-semibold text-primary transition-colors hover:bg-primary-50"
                  {...eventAttributes(EVENTS.serviceRequestClick, {
                    service: id,
                    location: "hero-secondary",
                  })}
                >
                  {secondary.label}
                </a>
              )}
            </div>
            <p className="text-center text-xs leading-5 text-neutral-70">{ts.requestFree}</p>
          </div>

          {facts.length > 0 && (
            <section aria-label={t.keyFacts} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {facts.map(({ label, value, icon }) => {
                const FactIcon = icon ? factIcons[icon] : undefined;
                return (
                  <div
                    key={label}
                    className="flex flex-col gap-2 rounded-xl border border-neutral-20 bg-white px-2.5 py-3 sm:p-4"
                  >
                    {FactIcon && <FactIcon width={22} height={22} className="text-primary" />}
                    <span className="text-xs font-medium text-neutral-60">{label}</span>
                    {/* Page direction for the alignment; bdi keeps Latin text ("Google Meet") in order */}
                    <span className="text-start text-sm font-bold text-neutral-100">
                      <bdi>{value}</bdi>
                    </span>
                  </div>
                );
              })}
            </section>
          )}

          <SectionNav sections={sections} variant="bar" locale={locale} />

          {included.length > 0 && (
            <section id="included" className={sectionClass}>
              <SectionTitle>{includedTitle}</SectionTitle>
              <ul className="flex flex-col gap-3">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-neutral-100">
                    <IconCheckCircle width={22} height={22} className="mt-0.5 shrink-0 text-primary" />
                    <span className="leading-7">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {steps.length > 0 && (
            <section id="steps" className={sectionClass}>
              <SectionTitle>{ts.steps}</SectionTitle>
              <ol className="flex flex-col gap-3">
                {steps.map((step, index) => (
                  <li key={step} className="flex items-start gap-3 text-neutral-100">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-primary">
                      {index + 1}
                    </span>
                    <span className="leading-7">{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {(forWho.length > 0 || notFor.length > 0) && (
            <section id="for-who" className={sectionClass}>
              <SectionTitle>{ts.forWho}</SectionTitle>
              <div className={`grid gap-3 ${forWho.length > 0 && notFor.length > 0 ? "sm:grid-cols-2" : ""}`}>
                {forWho.length > 0 && (
                  <ul className="flex flex-col gap-3 rounded-xl border border-neutral-20 bg-white p-4">
                    {forWho.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-neutral-100">
                        <IconCheckCircle width={18} height={18} className="mt-1 shrink-0 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {notFor.length > 0 && (
                  <div className="flex flex-col gap-3 rounded-xl border border-neutral-20 bg-neutral-5 p-4">
                    <p className="text-sm font-bold text-neutral-100">{ts.notFor}</p>
                    <ul className="flex flex-col gap-3">
                      {notFor.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-neutral-70">
                          <IconXCircle width={18} height={18} className="mt-1 shrink-0 text-neutral-60" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {honestNote && (
            <p className="rounded-xl bg-primary-50/60 p-4 text-sm leading-7 text-neutral-70">
              <span className="font-bold text-neutral-100">{ts.honestly}</span>
              {honestNote}
            </p>
          )}

          <section id="who" className={sectionClass}>
            <SectionTitle>{ts.whoAmI}</SectionTitle>
            <div className="flex items-center gap-4 rounded-xl border border-neutral-20 bg-white p-4">
              <Image
                src={linksProfile.imageUrl}
                unoptimized
                alt={linksProfile.name}
                width={64}
                height={64}
                className="size-16 shrink-0 rounded-full object-cover ring-4 ring-primary/15"
              />
              <div className="min-w-0">
                <p className="font-bold text-neutral-100">{t.trainerName}</p>
                <p className="mt-1 text-sm leading-6 text-neutral-70">{t.trainerBio}</p>
              </div>
            </div>
          </section>

          {faq.length > 0 && (
            <section id="faq" className={sectionClass}>
              <SectionTitle>{t.faq}</SectionTitle>
              <div className="flex flex-col gap-2">
                {faq.map((item) => (
                  <details
                    key={item.question}
                    className="group rounded-xl border border-neutral-20 bg-white p-4 [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-neutral-100">
                      {item.question}
                      <span className="text-xl leading-none text-primary transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-2 text-sm leading-6 text-neutral-70">{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Last call to action */}
          <section className="flex flex-col items-start gap-4 rounded-2xl bg-primary-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-neutral-100">{ts.startTitle}</h2>
              <p className="mt-1 text-sm leading-6 text-neutral-70">{t.askOnTelegramText}</p>
            </div>
            {requestButton("bottom", "shrink-0 text-sm")}
          </section>
        </div>
      </div>
    </div>
  );
}
