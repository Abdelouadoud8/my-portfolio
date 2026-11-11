import { IconFileText } from "@/components/shared/icons/icon-file-text";
import { EVENTS, eventAttributes } from "@/lib/analytics";
import type { FreeResource } from "@/data/types";

// Free guide on /links (data/links/links.ts `freeResources`): icon + title only. The guide is in Arabic, so the
// title stays RTL in every language.
export default function FreeResourceCard({ resource }: { resource: FreeResource }) {
  return (
    <a
      href={resource.href}
      target="_blank"
      rel="noopener noreferrer"
      dir="rtl"
      className="flex items-center gap-3 rounded-2xl border border-primary/40 bg-white p-4 shadow-[0_8px_30px_color-mix(in_srgb,var(--color-primary)_12%,transparent)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-primary"
      {...eventAttributes(EVENTS.freeResourceClick, { resource: resource.id, location: "links" })}
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
        <IconFileText width={24} height={24} />
      </span>
      <span className="min-w-0 flex-1 text-right font-arabic font-bold leading-snug text-neutral-100">
        {resource.title}
      </span>
    </a>
  );
}
