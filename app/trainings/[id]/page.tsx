import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { trainings } from "@/data/trainings/trainings";
import { linksProfile } from "@/data/links/links";
import SignupButton from "@/components/trainings/signup-button";
import { IconCalendar } from "@/components/shared/icons/icon-calendar";
import { IconClock } from "@/components/shared/icons/icon-clock";
import { IconVideoCamera } from "@/components/shared/icons/icon-video-camera";
import { IconTag } from "@/components/shared/icons/icon-tag";
import { IconUsers } from "@/components/shared/icons/icon-users";
import { IconChartBar } from "@/components/shared/icons/icon-chart-bar";
import { IconCheckCircle } from "@/components/shared/icons/icon-check-circle";
import { IconStar } from "@/components/shared/icons/icon-star";
import { IconGraduationCap } from "@/components/shared/icons/icon-graduation-cap";

export const dynamicParams = false;

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

// Arabic page: whole content is RTL with the Arabic font; English values (dates, tools) use dir="auto"
export default async function TrainingPage({ params }: Props) {
  const { id } = await params;
  const training = trainings.find((t) => t.id === id);
  if (!training) notFound();

  const {
    title,
    description,
    date,
    time,
    platform,
    price,
    level,
    maxParticipants,
    audience = [],
    outcomes = [],
    requirements = [],
    program = [],
    reviews = [],
    faq = [],
    signupHref,
  } = training;

  const facts = [
    { label: "التاريخ", value: date, Icon: IconCalendar },
    { label: "المدة", value: time, Icon: IconClock },
    { label: "وين", value: platform, Icon: IconVideoCamera },
    { label: "السعر", value: price, Icon: IconTag },
    {
      label: "عدد الأماكن",
      value: maxParticipants ? `${maxParticipants} مشارك` : undefined,
      Icon: IconUsers,
    },
    { label: "المستوى", value: level, Icon: IconChartBar },
  ].filter((fact) => fact.value);

  return (
    <div
      dir="rtl"
      className="font-arabic bg-[radial-gradient(70%_30%_at_50%_0%,rgba(230,57,70,0.08),transparent)]"
    >
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-12 px-4 pb-16 pt-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
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
          <section aria-label="المعلومات" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {facts.map(({ label, value, Icon }) => (
              <div
                key={label}
                className="flex flex-col gap-2 rounded-xl border border-neutral-20 bg-white p-4"
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

        {/* Trainer */}
        <section className="flex flex-col gap-4">
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
                مهندس برمجيات عايش في فرنسا و صانع محتوى في التكنولوجيا و الذكاء الإصطناعي.
              </p>
            </div>
          </div>
        </section>

        {outcomes.length > 0 && (
          <section className="flex flex-col gap-4">
            <SectionTitle>واش راح تتعلم</SectionTitle>
            <ul className="flex flex-col gap-3">
              {outcomes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-neutral-100">
                  <IconCheckCircle width={22} height={22} className="mt-0.5 shrink-0 text-primary" />
                  <span className="leading-7">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {program.length > 0 && (
          <section className="flex flex-col gap-4">
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

        {audience.length > 0 && (
          <section className="flex flex-col gap-4">
            <SectionTitle>لمن هاد التكوين؟</SectionTitle>
            <ul className="flex flex-col gap-3">
              {audience.map((item) => (
                <li key={item} className="flex items-start gap-3 text-neutral-100">
                  <IconCheckCircle width={22} height={22} className="mt-0.5 shrink-0 text-primary" />
                  <span className="leading-7">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {requirements.length > 0 && (
          <section className="flex flex-col gap-4">
            <SectionTitle>واش تحتاج</SectionTitle>
            <ul className="flex list-disc flex-col gap-2 ps-5 leading-7 text-neutral-100">
              {requirements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Reviews: empty until the first session */}
        <section className="flex flex-col gap-4">
          <SectionTitle>آراء المشاركين</SectionTitle>
          {reviews.length > 0 ? (
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
          ) : (
            <p className="rounded-xl bg-neutral-5 p-4 text-sm leading-6 text-neutral-70">
              هادي أول دورة: الآراء تاع المشاركين راح يبانو هنا من بعد.
            </p>
          )}
        </section>

        {faq.length > 0 && (
          <section className="flex flex-col gap-4">
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

        <SignupButton trainingId={id} href={signupHref} location="bottom" />
      </div>
    </div>
  );
}
