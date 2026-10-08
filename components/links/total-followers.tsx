import type { SocialLink } from "@/data/types";
import { formatCompact } from "@/lib/utils";
import { platformIcons } from "./social-link-button";

// Total followers: sum of every visible link that has a follower count (Instagram uses the live
// daily count). Big number, "Total followers" label, then the counted platforms' icons.
// Hidden when no link has a count.
export default function TotalFollowers({ socials }: { socials: SocialLink[] }) {
  const counted = socials.filter(
    (link) =>
      !link.comingSoon && link.href && typeof link.followers === "number",
  );
  const total = counted.reduce((sum, link) => sum + (link.followers ?? 0), 0);
  if (counted.length === 0 || total === 0) return null;

  const names = counted.map((link) => link.label);
  const platforms =
    names.length > 1
      ? `${names.slice(0, -1).join(", ")} & ${names.at(-1)}`
      : names[0];

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
        <p className="mt-2 text-xs font-bold uppercase tracking-wide text-primary">
          Followers across all platforms
        </p>
      </div>
      <ul className="flex items-center gap-2" aria-hidden="true">
        {counted.map((link) => {
          const Icon = platformIcons[link.platform];
          return (
            <li
              key={link.platform}
              title={link.label}
              className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary"
            >
              <Icon width={20} height={20} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
