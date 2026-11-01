import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { trainings } from "@/data/trainings/trainings";
import { linksProfile, linksSocials } from "@/data/links/links";
import { getInstagramFollowers } from "@/lib/instagram-followers";
import { getLiveSeats } from "@/lib/training-seats";
import { DYNAMIC_EVENTS, EVENTS, eventAttributes } from "@/lib/analytics";
import { formatCompact } from "@/lib/utils";
import { IconInstagram } from "@/components/shared/icons/icon-instagram";
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

const paymentIcons: Record<TrainingPaymentMethod["kind"], typeof IconMailbox> = {
  baridimob: IconDeviceMobile,
  "post-office": IconMailbox,
};

export const dynamicParams = false;

// Live Instagram follower count in the trainer section, refreshed twice a day like /links (FOLLOWERS_CACHE_SECONDS)
export const revalidate = 43200;

export function generateStaticParams() {
  return trainings.map((training) => ({ id: training.id }));
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const training = trainings.find((t) => t.id === id);
  return training ? { title: training.title, description: training.description } : {};
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

// Arabic page: whole content is RTL with the Arabic font; English values (dates, tools) use dir="auto"
export default async function TrainingPage({ params }: Props) {
  const { id } = await params;
  const training = trainings.find((t) => t.id === id);
  if (!training) notFound();

  const {
    title,
    description,
    time,
    platform,
    price,
    level,
    audience = [],
    outcomes = [],
    requirements = [],
    sessions: dataSessions = [],
    registrationSteps = [],
    paymentMethods = [],
    program = [],
    reviews = [],
    faq = [],
    signupHref,
    questionsHref,
    telegramBot,
  } = training;

  // Once the registration bot is live, seats left come from it (paid + held), else from the data file
  const liveSeats = telegramBot ? await getLiveSeats(id) : undefined;
  const sessions = dataSessions.map((session) => ({
    ...session,
    seatsLeft: liveSeats?.[`${id}_${session.id}`] ?? session.seatsLeft,
  }));

  // Trainer section: Instagram link + live follower count (falls back to the count in data/links/links.ts)
  const instagram = linksSocials.find((social) => social.platform === "instagram");
  const instagramFollowers = (await getInstagramFollowers()) ?? instagram?.followers;

  // Sticky bar: the next session that still has places (no bar once every session is full)
  const nextSession = sessions.find((session) => session.seatsLeft > 0);

  // Date, duration and seats are per session now (see the sessions cards), so only these stay on top
  const facts = [
    { label: "المكان", value: platform, Icon: IconVideoCamera },
    { label: "السعر", value: price, Icon: IconTag },
    { label: "المستوى", value: level, Icon: IconChartBar },
  ].filter((fact) => fact.value);

  // Right-side navigation (top chips on phones): only the sections this training has
  const sections = [
    { id: "sessions", label: "الحصص", show: sessions.length > 0 },
    { id: "registration", label: "كيفاش تسجل", show: true },
    { id: "trainer", label: "المكوّن", show: true },
    { id: "outcomes", label: "واش راح تتعلم", show: outcomes.length > 0 },
    { id: "program", label: "البرنامج", show: program.length > 0 },
    {
      id: "audience",
      label: "لمن هاد التكوين؟",
      show: audience.length > 0 || requirements.length > 0,
    },
    { id: "reviews", label: "آراء المشاركين", show: reviews.length > 0 },
    { id: "faq", label: "أسئلة متكررة", show: faq.length > 0 },
  ]
    .filter((section) => section.show)
    .map(({ id, label }): NavSection => ({ id, label }));

  return (
    <div
      dir="rtl"
      className="font-arabic bg-[radial-gradient(70%_30%_at_50%_0%,color-mix(in_srgb,var(--color-primary)_8%,transparent),transparent)]"
    >
      <div className="mx-auto w-full max-w-2xl px-4 pb-16 pt-8 animate-in fade-in slide-in-from-bottom-2 duration-500 lg:grid lg:max-w-5xl lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-16">
        {/* First column = right side in RTL */}
        <aside className="hidden lg:block">
          <SectionNav sections={sections} variant="side" />
        </aside>

        <div className="flex min-w-0 max-w-2xl flex-col gap-12">
          <Link
            href="/links"
            className="self-start text-sm font-medium text-neutral-70 transition-colors hover:text-primary"
          >
            → رجوع للروابط
          </Link>

          {/* Hero */}
          <header className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
                <IconGraduationCap width={28} height={28} />
              </span>
              {price && (
                <span className="rounded-full bg-primary-50 px-3 py-1 text-sm font-bold text-primary">
                  {price}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold leading-[1.4] text-neutral-100">{title}</h1>
            {description && <p className="text-base leading-8 text-neutral-70">{description}</p>}
          </header>

          {/* Key facts */}
          {facts.length > 0 && (
            <section aria-label="المعلومات" className="grid grid-cols-3 gap-3">
              {facts.map(({ label, value, Icon }) => (
                <div
                  key={label}
                  className="flex flex-col gap-2 rounded-xl border border-neutral-20 bg-white px-2.5 py-3 sm:p-4"
                >
                  <Icon width={22} height={22} className="text-primary" />
                  <span className="text-xs font-medium text-neutral-60">{label}</span>
                  <span dir="auto" className="text-start text-sm font-bold text-neutral-100">
                    {value}
                  </span>
                </div>
              ))}
            </section>
          )}

          <SectionNav sections={sections} variant="bar" />

          {/* Sessions: horizontal cards (variant="vertical" = cards side by side) */}
          {sessions.length > 0 && (
            <section id="sessions" className="flex scroll-mt-20 flex-col gap-4 lg:scroll-mt-8">
              <SectionTitle>الحصص</SectionTitle>
              <SessionCards
                trainingId={id}
                sessions={sessions}
                signupHref={signupHref}
                telegramBot={telegramBot}
                duration={time}
                variant="horizontal"
              />
            </section>
          )}

          {/* How registration works: empty until the flow is decided */}
          <section id="registration" className="flex scroll-mt-20 flex-col gap-4 lg:scroll-mt-8">
            <SectionTitle>كيفاش تسجل</SectionTitle>
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
                خطوات التسجيل راح تكون هنا قريبا.
              </p>
            )}
          </section>

          {paymentMethods.length > 0 && (
            <section id="payment" className="flex scroll-mt-20 flex-col gap-4 lg:scroll-mt-8">
              <SectionTitle>طرق الدفع</SectionTitle>
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
            <SectionTitle>المكوّن</SectionTitle>
            <div className="flex items-center gap-4 rounded-xl border border-neutral-20 bg-white p-4">
              <Image
                src={linksProfile.imageUrl}
                alt={linksProfile.name}
                width={64}
                height={64}
                className="size-16 shrink-0 rounded-full object-cover ring-4 ring-primary/15"
              />
              <div className="min-w-0">
                <p className="font-bold text-neutral-100">عبدالودود مهداوي</p>
                <p className="mt-1 text-sm leading-6 text-neutral-70">
                  مهندس في الإعلام الآلي متخرج من المدرسة العليا للإعلام الآلي بالجزائر وجامعة مونبلييه في
                  فرنسا، وصانع محتوى في التكنولوجيا والذكاء الاصطناعي.
                </p>
                {instagram?.href && (
                  <a
                    href={instagram.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Instagram ${instagram.handle}`}
                    className="mt-3 inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-primary-50 px-3 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary-100"
                    {...eventAttributes(DYNAMIC_EVENTS.socialClick("instagram", "training"), {
                      platform: "instagram",
                      location: "training",
                    })}
                  >
                    <IconInstagram width={18} height={18} />
                    {/* Phones: icon + count only (the handle doesn't fit next to the photo) */}
                    <bdi dir="ltr" className="hidden sm:inline">
                      {instagram.handle}
                    </bdi>
                    {instagramFollowers && (
                      <span className="sm:font-normal sm:text-neutral-70">
                        <span className="hidden sm:inline">· </span>
                        <bdi dir="ltr">{formatCompact(instagramFollowers)}</bdi> متابع
                      </span>
                    )}
                  </a>
                )}
              </div>
            </div>
          </section>

          {outcomes.length > 0 && (
            <section id="outcomes" className="flex scroll-mt-20 flex-col gap-4 lg:scroll-mt-8">
              <SectionTitle>واش راح تتعلم</SectionTitle>
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
              <SectionTitle>البرنامج</SectionTitle>
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
          {(audience.length > 0 || requirements.length > 0) && (
            <section id="audience" className="flex scroll-mt-20 flex-col gap-4 lg:scroll-mt-8">
              <SectionTitle>لمن هاد التكوين؟</SectionTitle>
              <ul className="flex flex-col gap-3">
                {[...audience, ...requirements].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-neutral-100">
                    <IconCheckCircle width={20} height={20} className="mt-1 shrink-0 text-primary" />
                    <span className="leading-7">
                      <WithLatinBrackets text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Reviews: hidden until the first ones are added to the data */}
          {reviews.length > 0 && (
            <section id="reviews" className="flex scroll-mt-20 flex-col gap-4 lg:scroll-mt-8">
              <SectionTitle>آراء المشاركين</SectionTitle>
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
            </section>
          )}

          {faq.length > 0 && (
            <section id="faq" className="flex scroll-mt-20 flex-col gap-4 lg:scroll-mt-8">
              <SectionTitle>أسئلة متكررة</SectionTitle>
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
                <h2 className="text-lg font-bold text-neutral-100">عندك سؤال؟</h2>
                <p className="mt-1 text-sm leading-6 text-neutral-70">ابعثلي رسالة على تيليغرام و نجاوبك.</p>
              </div>
              <a
                href={questionsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
                {...eventAttributes(EVENTS.trainingQuestionClick, { training: id })}
              >
                <IconTelegram width={20} height={20} />
                اسألني على تيليغرام
              </a>
            </section>
          )}
        </div>
      </div>

      {nextSession && (
        <>
          {/* Room for the sticky bar so it never covers the end of the page */}
          <div aria-hidden className="h-20" />
          <StickyRegisterBar
            date={nextSession.date}
            time={nextSession.time}
            price={nextSession.price}
            oldPrice={nextSession.oldPrice}
            targetId="sessions"
          />
        </>
      )}
    </div>
  );
}
