import type { SocialLink } from "@/data/types";
import { formatCompact } from "@/lib/utils";
import { DYNAMIC_EVENTS, eventAttributes } from "@/lib/analytics";
import { platformIcons } from "@/components/shared/social/social-link-button";

// Total followers: sum of every visible link that has a follower count (Instagram uses the live
// daily count). Big number, "Total followers" label, then one icon per visible platform, each a link to the
// profile (this row replaced the list of social buttons on /links). Hidden when no link has a count.
export default function TotalFollowers({
  socials,
  label = "Followers across all platforms",
}: {
  socials: SocialLink[];
  label?: string;
}) {
  const counted = socials.filter(
    (link) => !link.comingSoon && link.href && typeof link.followers === "number",
  );
  const total = counted.reduce((sum, link) => sum + (link.followers ?? 0), 0);
  if (counted.length === 0 || total === 0) return null;

  const linked = socials.filter((link) => !link.comingSoon && link.href);
  const names = counted.map((link) => link.label);
  const platforms = names.length > 1 ? `${names.slice(0, -1).join(", ")} & ${names.at(-1)}` : names[0];

  return (
    <div
      className="flex flex-col items-center gap-3 text-center"
      aria-label={`${total.toLocaleString("en")} total followers across ${platforms}`}
    >
      <div className="flex flex-col items-center">
        <p
          className="text-4xl font-bold leading-none text-neutral-100"
          title={`${total.toLocaleString("en")} followers`}
        >
          {formatCompact(total)}
        </p>
        <p className="mt-2 text-xs font-bold uppercase tracking-wide text-primary">{label}</p>
      </div>
      <ul className="flex items-center gap-3">
        {linked.map((link) => {
          const Icon = platformIcons[link.platform];
          return (
            <li key={link.platform}>
              {/* Same event as the old social buttons (links-<platform>-click): the Umami Links tab counts them */}
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                title={link.label}
                className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                {...eventAttributes(DYNAMIC_EVENTS.socialClick(link.platform, "links"), {
                  platform: link.platform,
                  location: "links",
                })}
              >
                <Icon width={22} height={22} />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
