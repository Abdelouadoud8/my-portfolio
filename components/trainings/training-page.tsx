import type { Metadata } from "next";
import { sitePreviewImage } from "@/lib/link-preview";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { trainings } from "@/data/trainings/trainings";
import { linksProfile, linksSocials } from "@/data/links/links";
import { getVisibleSocials } from "@/lib/instagram-followers";
import { nextSession, withLiveSeats } from "@/lib/trainings";
import { localizeSessions, localizeTraining } from "@/lib/localize";
import { languageAlternates, localeMeta, localePath, localePaths, ui, type Locale } from "@/lib/i18n";
import SiteHeader from "@/components/links/site-header";
import BookingBox from "@/components/trainings/booking-box";
import { DYNAMIC_EVENTS, EVENTS, eventAttributes } from "@/lib/analytics";
import { cn, formatCompact } from "@/lib/utils";
import { platformIcons } from "@/components/shared/social/social-link-button";
import { IconTelegram } from "@/components/shared/icons/icon-telegram";
import SectionNav, { type NavSection } from "@/components/trainings/section-nav";
import SessionCards from "@/components/trainings/session-cards";
import StickyRegisterBar from "@/components/trainings/sticky-register-bar";
import { IconVideoCamera } from "@/components/shared/icons/icon-video-camera";
import { IconTag } from "@/components/shared/icons/icon-tag";
import { IconChartBar } from "@/components/shared/icons/icon-chart-bar";
import { IconCheckCircle } from "@/components/shared/icons/icon-check-circle";
import { IconStar } from "@/components/shared/icons/icon-star";
import { IconGraduationCap } from "@/components/shared/icons/icon-graduation-cap";
import { IconDeviceMobile } from "@/components/shared/icons/icon-device-mobile";
import { IconMailbox } from "@/components/shared/icons/icon-mailbox";
import type { TrainingPaymentMethod } from "@/data/types";
import { IconXCircle } from "@/components/shared/icons/icon-x-circle";

const paymentIcons: Record<TrainingPaymentMethod["kind"], typeof IconMailbox> = {
  baridimob: IconDeviceMobile,
  "post-office": IconMailbox,
};

// Metadata of /trainings/<id> in one language (Darja, /en/…, /fr/…)
export function trainingMetadata(id: string, locale: Locale): Metadata {
  const base = trainings.find((t) => t.id === id);
  if (!base) return {};
  const training = localizeTraining(base, locale);
  return {
    title: training.title,
    description: training.description,
    alternates: languageAlternates(`/trainings/${id}`),
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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-bold text-neutral-100">{children}</h2>;
}

// An English list in brackets inside an Arabic line ("(graphic design, social media …") gets scrambled
// when the line wraps: isolate the English part as LTR
function WithLatinBrackets({ text }: { text: string }) {
  const match = text.match(/^(.*\()([A-Za-z][A-Za-z ,]*[A-Za-z])(.*)$/);
  if (!match) return text;
  return (
    <>
      {match[1]}
      <bdi dir="ltr">{match[2]}</bdi>
      {match[3]}
    </>
  );
}

// Training details page in one language. Darja: RTL with the Arabic font, English values (dates, tools) use
// dir="auto"; English/French: LTR with the site font. Text comes from lib/localize, interface text from lib/i18n.
export default async function TrainingPageContent({ id, locale }: { id: string; locale: Locale }) {
  const base = trainings.find((t) => t.id === id);
  if (!base) notFound();
  const training = localizeTraining(base, locale);
  const t = ui[locale];
  const tt = t.training;
  const { dir } = localeMeta[locale];

  const {
    title,
    description,
    time,
    platform,
    price,
    level,
    audience = [],
    notFor = [],
    outcomes = [],
    requirements = [],
    registrationSteps = [],
    paymentMethods = [],
    program = [],
    reviews = [],
    feedbackImages = [],
    faq = [],
    signupHref,
    questionsHref,
    telegramBot,
  } = training;

  // Once the registration bot is live, seats left come from it (paid + held), else from the data file
  const sessions = localizeSessions(await withLiveSeats(base), locale);

  // Live follower counts (fall back to data/links/links.ts): Instagram + Facebook in the trainer card, total under the price box
  const socials = await getVisibleSocials(linksSocials);
  const trainerSocials = (["instagram", "facebook"] as const)
    .map((platform) => socials.find((social) => social.platform === platform))
    .filter((social) => social?.href) as typeof socials;
  const totalFollowers = socials.reduce((sum, social) => sum + (social.followers ?? 0), 0);

  // Price box + sticky bar: the session people can book now, else the next one with places (none once all are full)
  const pushedSession = nextSession({ id, telegramBot, signupHref }, sessions);

  // Date, duration and seats are per session now (see the sessions cards), so only these stay on top
  // Price card: the next session's price with the old one struck through, else the training's price text
  const facts: { label: string; value?: string; oldValue?: string; Icon: typeof IconTag }[] = [
    { label: tt.place, value: platform, Icon: IconVideoCamera },
    {
      label: t.price,
      value: pushedSession?.price ?? price,
      oldValue: pushedSession?.oldPrice,
      Icon: IconTag,
    },
    { label: tt.level, value: level, Icon: IconChartBar },
  ].filter((fact) => fact.value);

  // Right-side navigation (top chips on phones): only the sections this training has
  const sections = [
    { id: "sessions", label: tt.sessions, show: sessions.length > 0 },
    { id: "registration", label: tt.registration, show: true },
    { id: "trainer", label: tt.trainer, show: true },
    { id: "reviews", label: tt.reviews, show: feedbackImages.length > 0 || reviews.length > 0 },
    { id: "outcomes", label: tt.outcomes, show: outcomes.length > 0 },
    { id: "program", label: tt.program, show: program.length > 0 },
    {
      id: "audience",
      label: tt.audience,
      show: audience.length > 0 || requirements.length > 0 || notFor.length > 0,
    },
    { id: "faq", label: t.faq, show: faq.length > 0 },
  ]
    .filter((section) => section.show)
    .map(({ id, label }): NavSection => ({ id, label }));

  return (
    <div
      dir={dir}
      lang={localeMeta[locale].lang}
      className={`${locale === "ar" ? "font-arabic" : ""} bg-[radial-gradient(70%_30%_at_50%_0%,color-mix(in_srgb,var(--color-primary)_8%,transparent),transparent)]`}
    >
      <SiteHeader locale={locale} paths={localePaths(`/trainings/${id}`)} active="training" trainingId={id} />
      <div className="mx-auto w-full max-w-2xl px-4 pb-16 pt-8 animate-in fade-in slide-in-from-bottom-2 duration-500 lg:grid lg:max-w-5xl lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-16">
        {/* First column = right side in RTL */}
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

          {/* Hero */}
          <header className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
                <IconGraduationCap width={28} height={28} />
              </span>
              {(training.badge ?? price) && (
                <span className="rounded-full bg-primary-50 px-3 py-1 text-sm font-bold text-primary">
                  {training.badge ?? price}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold leading-[1.4] text-neutral-100">{title}</h1>
            {description && <p className="text-base leading-8 text-neutral-70">{description}</p>}
          </header>

          <BookingBox
            training={{ id, telegramBot, signupHref }}
            session={pushedSession}
            totalFollowers={totalFollowers}
            locale={locale}
          />

          {/* Key facts */}
          {facts.length > 0 && (
            <section aria-label={t.keyFacts} className="grid grid-cols-3 gap-3">
              {facts.map(({ label, value, oldValue, Icon }) => (
                <div
                  key={label}
                  className="flex flex-col gap-2 rounded-xl border border-neutral-20 bg-white px-2.5 py-3 sm:p-4"
                >
                  <Icon width={22} height={22} className="text-primary" />
                  <span className="text-xs font-medium text-neutral-60">{label}</span>
                  {/* Page direction for the alignment (right in Darja, even for "Google Meet"); bdi keeps the Latin text in order */}
                  <span className="flex flex-wrap items-baseline gap-x-1.5 text-start text-sm font-bold text-neutral-100">
                    <bdi className="whitespace-nowrap">{value}</bdi>
                    {oldValue && (
                      <s className="whitespace-nowrap text-xs font-normal text-neutral-70">
                        <span className="sr-only">{t.insteadOf}</span>
                        <bdi>{oldValue}</bdi>
                      </s>
                    )}
                  </span>
                </div>
              ))}
            </section>
          )}

          <SectionNav sections={sections} variant="bar" locale={locale} />

          {/* Sessions: horizontal cards (variant="vertical" = cards side by side) */}
          {sessions.length > 0 && (
            <section id="sessions" className="flex scroll-mt-20 flex-col gap-4 lg:scroll-mt-8">
              <SectionTitle>{tt.sessions}</SectionTitle>
              <SessionCards
                trainingId={id}
                sessions={sessions}
                signupHref={signupHref}
                telegramBot={telegramBot}
                duration={time}
                variant="horizontal"
                locale={locale}
              />
            </section>
          )}

          {/* How registration works: empty until the flow is decided */}
          <section id="registration" className="flex scroll-mt-20 flex-col gap-4 lg:scroll-mt-8">
            <SectionTitle>{tt.registration}</SectionTitle>
            {registrationSteps.length > 0 ? (
              <ol className="flex flex-col gap-3">
                {registrationSteps.map((step, index) => (
                  <li key={step} className="flex items-start gap-3 text-neutral-100">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-primary">
                      {index + 1}
                    </span>
                    <span className="leading-7">{step}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="rounded-xl border border-dashed border-neutral-30 p-4 text-sm leading-6 text-neutral-70">
                {tt.registrationSoon}
              </p>
            )}
          </section>

          {paymentMethods.length > 0 && (
            <section id="payment" className="flex scroll-mt-20 flex-col gap-4 lg:scroll-mt-8">
              <SectionTitle>{tt.payment}</SectionTitle>
              {/* Phones: one under the other; sm+: side by side. In each: icon on the right, title with the description under it */}
              <ul className="grid gap-3 sm:grid-cols-2">
                {paymentMethods.map((method) => {
                  const Icon = paymentIcons[method.kind];
                  return (
                    <li
                      key={method.kind}
                      className="flex items-start gap-2.5 rounded-xl border border-neutral-20 bg-white p-3 sm:items-center sm:gap-3 sm:p-4"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary sm:size-11">
                        <Icon width={22} height={22} />
                      </span>
                      <div className="min-w-0 text-start">
                        {/* bdi: the Latin title stays right-aligned in the RTL card */}
                        <p className="text-sm font-bold text-neutral-100 sm:text-base">
                          <bdi>{method.title}</bdi>
                        </p>
                        <p className="text-xs leading-5 text-neutral-70 sm:text-sm sm:leading-6">
                          {method.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* Trainer */}
          <section id="trainer" className="flex scroll-mt-20 flex-col gap-4 lg:scroll-mt-8">
            <SectionTitle>{tt.trainer}</SectionTitle>
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
                {/* Instagram + Facebook chips with the live follower counts (phones: icon + count only) */}
                {trainerSocials.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {trainerSocials.map((social) => {
                      const Icon = platformIcons[social.platform];
                      // Instagram shows its @handle, Facebook its name (the page name is too long)
                      const name = social.platform === "instagram" ? social.handle : social.label;
                      return (
                        <a
                          key={social.platform}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${social.label} ${social.handle}`}
                          className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-primary-50 px-3 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary-100"
                          {...eventAttributes(DYNAMIC_EVENTS.socialClick(social.platform, "training"), {
                            platform: social.platform,
                            location: "training",
                          })}
                        >
                          <Icon width={18} height={18} />
                          <bdi dir="ltr" className="hidden sm:inline">
                            {name}
                          </bdi>
                          {social.followers ? (
                            <span className="sm:font-normal sm:text-neutral-70">
                              <span className="hidden sm:inline">· </span>
                              <bdi dir="ltr">{formatCompact(social.followers)}</bdi> {t.followers}
                            </span>
                          ) : null}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Participants' feedback (like withrssle): message screenshots as a masonry grid, then text reviews if any */}
          {(feedbackImages.length > 0 || reviews.length > 0) && (
            <section id="reviews" className="flex scroll-mt-20 flex-col gap-4 lg:scroll-mt-8">
              <div className="flex flex-col gap-1">
                <SectionTitle>{tt.reviews}</SectionTitle>
                {feedbackImages.length > 0 && (
                  <p className="text-sm leading-6 text-neutral-70">{tt.reviewsIntro}</p>
                )}
              </div>
              {feedbackImages.length > 0 && (
                <div className="columns-1 gap-3 sm:columns-2">
                  {feedbackImages.map((image) => (
                    <figure
                      key={image.src}
                      className="mb-3 break-inside-avoid overflow-hidden rounded-2xl border border-neutral-20 bg-white shadow-xs transition-all hover:border-primary/40 hover:shadow-md"
                    >
                      <Image
                        src={image.src}
                        alt={tt.feedbackAlt}
                        width={image.width}
                        height={image.height}
                        // Already compressed WebP (~20-50 KB): served as is, so a busy day costs no Image Optimization
                        unoptimized
                        className="h-auto w-full"
                      />
                    </figure>
                  ))}
                </div>
              )}
              {reviews.length > 0 && (
                <div className="flex flex-col gap-3">
                  {reviews.map((review) => (
                    <figure
                      key={review.name + review.text}
                      className="flex flex-col gap-2 rounded-xl border border-neutral-20 bg-white p-4"
                    >
                      {review.rating && (
                        <div className="flex gap-0.5 text-primary" aria-label={`${review.rating}/5`}>
                          {Array.from({ length: review.rating }, (_, i) => (
                            <IconStar key={i} width={16} height={16} />
                          ))}
                        </div>
                      )}
                      <blockquote className="leading-7 text-neutral-100">{review.text}</blockquote>
                      <figcaption dir="auto" className="text-start text-sm font-semibold text-neutral-70">
                        {review.name}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              )}
            </section>
          )}

          {outcomes.length > 0 && (
            <section id="outcomes" className="flex scroll-mt-20 flex-col gap-4 lg:scroll-mt-8">
              <SectionTitle>{tt.outcomes}</SectionTitle>
              <ul className="flex flex-col gap-3">
                {outcomes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-neutral-100">
                    <IconCheckCircle width={22} height={22} className="mt-0.5 shrink-0 text-primary" />
                    <span className="leading-7">
                      <WithLatinBrackets text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {program.length > 0 && (
            <section id="program" className="flex scroll-mt-20 flex-col gap-4 lg:scroll-mt-8">
              <SectionTitle>{tt.program}</SectionTitle>
              <ol className="flex flex-col gap-3">
                {program.map((module, index) => (
                  <li
                    key={module.title}
                    className="flex gap-4 rounded-xl border border-neutral-20 bg-white p-4"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                        <h3 dir="auto" className="text-start font-bold text-neutral-100">
                          {module.title}
                        </h3>
                        <span className="text-xs font-medium text-primary">{module.duration}</span>
                      </div>
                      <ul className="flex list-disc flex-col gap-1 ps-5 text-sm leading-6 text-neutral-70">
                        {module.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Who it's for + what you need: one tick list, one item per line */}
          {(audience.length > 0 || requirements.length > 0 || notFor.length > 0) && (
            <section id="audience" className="flex scroll-mt-20 flex-col gap-4 lg:scroll-mt-8">
              <SectionTitle>{tt.audience}</SectionTitle>
              {/* Two cards side by side from sm up (one under the other on phones): who it's for | not for you if */}
              <div className={cn("grid gap-3", notFor.length > 0 && "sm:grid-cols-2")}>
                <ul className="flex flex-col gap-3 rounded-xl border border-neutral-20 bg-white p-4">
                  {[...audience, ...requirements].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-neutral-100">
                      <IconCheckCircle width={18} height={18} className="mt-1 shrink-0 text-primary" />
                      <span>
                        <WithLatinBrackets text={item} />
                      </span>
                    </li>
                  ))}
                </ul>
                {notFor.length > 0 && (
                  <div className="flex flex-col gap-3 rounded-xl border border-neutral-20 bg-neutral-5 p-4">
                    <p className="text-sm font-bold text-neutral-100">{tt.notFor}</p>
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

          {/* Reviews: hidden until the first ones are added to the data */}
          {faq.length > 0 && (
            <section id="faq" className="flex scroll-mt-20 flex-col gap-4 lg:scroll-mt-8">
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

          {/* Questions: direct chat (Telegram) */}
          {questionsHref && (
            <section className="flex flex-col items-start gap-4 rounded-2xl bg-primary-50 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-neutral-100">{tt.questionTitle}</h2>
                <p className="mt-1 text-sm leading-6 text-neutral-70">{t.askOnTelegramText}</p>
              </div>
              <a
                href={questionsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
                {...eventAttributes(EVENTS.trainingQuestionClick, { training: id })}
              >
                <IconTelegram width={20} height={20} />
                {tt.questionButton}
              </a>
            </section>
          )}
        </div>
      </div>

      {pushedSession && (
        <>
          {/* Room for the sticky bar so it never covers the end of the page */}
          <div aria-hidden className="h-20" />
          <StickyRegisterBar
            date={pushedSession.date}
            time={pushedSession.time}
            price={pushedSession.price}
            oldPrice={pushedSession.oldPrice}
            targetId="sessions"
            locale={locale}
          />
        </>
      )}
    </div>
  );
}
