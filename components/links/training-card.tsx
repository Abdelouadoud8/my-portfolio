import Link from "next/link";
import { Training } from "@/data/types";
import { EVENTS, eventAttributes } from "@/lib/analytics";
import { IconGraduationCap } from "@/components/shared/icons/icon-graduation-cap";
import { IconCalendar } from "@/components/shared/icons/icon-calendar";
import { IconClock } from "@/components/shared/icons/icon-clock";
import { IconVideoCamera } from "@/components/shared/icons/icon-video-camera";
import { IconTag } from "@/components/shared/icons/icon-tag";

export default function TrainingCard({
  id,
  title,
  description,
  date,
  time,
  platform,
  price,
}: Training) {
  const details = [
    { label: "date", value: date, Icon: IconCalendar },
    { label: "time", value: time, Icon: IconClock },
    { label: "platform", value: platform, Icon: IconVideoCamera },
    { label: "price", value: price, Icon: IconTag },
  ].filter((item) => item.value);

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-neutral-20 bg-white p-5 shadow-[0_6px_20px_rgba(230,57,70,0.08)]">
      {/* dir="rtl": Arabic title, icon on the right */}
      <div dir="rtl" className="flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
          <IconGraduationCap width={26} height={26} />
        </span>
        <h3 dir="auto" className="text-lg font-bold leading-7 text-neutral-100">
          {title}
        </h3>
      </div>

      {description && (
        <p dir="auto" className="text-sm leading-6 text-neutral-70">
          {description}
        </p>
      )}

      {details.length > 0 && (
        // dir="rtl": 2x2 grid starting on the right, icon before the text like the title
        <div dir="rtl" className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm font-medium text-neutral-70">
          {details.map(({ label, value, Icon }) => (
            <span key={label} className="flex items-center gap-1.5">
              <Icon width={18} height={18} className="text-primary" />
              <span dir="auto">{value}</span>
            </span>
          ))}
        </div>
      )}

      <Link
        href={`/trainings/${id}`}
        className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 font-semibold text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-primary-600"
        {...eventAttributes(EVENTS.trainingDetailsClick, {
          training: id,
          location: "links",
        })}
      >
        تفاصيل الدورة
      </Link>
    </article>
  );
}
