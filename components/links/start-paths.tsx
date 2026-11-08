import Link from "next/link";
import { Building2, UserRound } from "lucide-react";
import { EVENTS, eventAttributes } from "@/lib/analytics";
import { localeMeta, localePath, ui, type Locale } from "@/lib/i18n";
import { IconGraduationCap } from "@/components/shared/icons/icon-graduation-cap";
import { IconTelegram } from "@/components/shared/icons/icon-telegram";

type StartPathsProps = {
  locale?: Locale;
  // Training details page (/trainings/<id>)
  trainingId?: string;
  // Direct chat for questions (Telegram username link)
  questionsHref?: string;
};

// "منين تحب تبدا؟": one entry point per offer (group training / 1:1 call / companies) plus a question,
// so nobody has to scroll the whole page to find their next step
export default function StartPaths({ locale = "ar", trainingId, questionsHref }: StartPathsProps) {
  const t = ui[locale].links;
  const rtl = localeMeta[locale].dir === "rtl";
  const rowClass =
    "group flex items-center gap-3 rounded-xl border border-neutral-20 bg-white p-3.5 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-primary";
  const iconClass = "flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary";
  // Pinned to the far end of the row (left in RTL, right in LTR), whatever the text length
  const arrow = (
    <span
      aria-hidden
      className={`${rtl ? "mr-auto" : "ml-auto"} shrink-0 text-lg text-neutral-40 transition-colors group-hover:text-primary`}
    >
      {rtl ? "←" : "→"}
    </span>
  );
  const text = ([title, subtitle]: string[]) => (
    <span className="flex min-w-0 flex-col">
      <span className="font-semibold text-neutral-100">{title}</span>
      <span className="text-xs text-neutral-70">{subtitle}</span>
    </span>
  );

  return (
    <section aria-labelledby="start" dir={localeMeta[locale].dir} className="flex flex-col gap-3">
      <h2 id="start" className="text-center text-base font-bold text-neutral-100">
        {t.startTitle}
      </h2>

      {trainingId && (
        <Link
          href={localePath(locale, `/trainings/${trainingId}`)}
          className={rowClass}
          {...eventAttributes(EVENTS.trainingDetailsClick, { training: trainingId, location: "links-path" })}
        >
          <span className={iconClass}>
            <IconGraduationCap width={22} height={22} />
          </span>
          {text(t.pathTraining)}
          {arrow}
        </Link>
      )}

      <Link
        href={localePath(locale, "/services/one-to-one")}
        className={rowClass}
        {...eventAttributes(EVENTS.serviceDetailsClick, { service: "one-to-one", location: "links-path" })}
      >
        <span className={iconClass}>
          <UserRound size={22} strokeWidth={1.75} />
        </span>
        {text(t.pathOneToOne)}
        {arrow}
      </Link>

      <Link
        href={localePath(locale, "/services/business")}
        className={rowClass}
        {...eventAttributes(EVENTS.serviceDetailsClick, { service: "business", location: "links-path" })}
      >
        <span className={iconClass}>
          <Building2 size={22} strokeWidth={1.75} />
        </span>
        {text(t.pathBusiness)}
        {arrow}
      </Link>

      {questionsHref && (
        <a
          href={questionsHref}
          target="_blank"
          rel="noopener noreferrer"
          className={rowClass}
          {...eventAttributes(EVENTS.trainingQuestionClick, { training: trainingId ?? "links" })}
        >
          <span className={iconClass}>
            <IconTelegram width={22} height={22} />
          </span>
          {text(t.pathQuestion)}
          {arrow}
        </a>
      )}
    </section>
  );
}
