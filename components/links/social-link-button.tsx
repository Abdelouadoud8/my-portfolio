import React from "react";
import { ArrowUpRight } from "lucide-react";
import { SocialLink, SocialPlatform } from "@/data/types";
import { DYNAMIC_EVENTS, eventAttributes } from "@/lib/analytics";
import { formatCompact } from "@/lib/utils";
import { IconProps } from "../icons/icon-arrow-right";
import { IconInstagram } from "../icons/icon-instagram";
import { IconTiktok } from "../icons/icon-tiktok";
import { IconLinkedin } from "../icons/icon-linkedin";
import { IconSnapchat } from "../icons/icon-snapchat";
import { IconTelegram } from "../icons/icon-telegram";
import { IconYoutube } from "../icons/icon-youtube";
import { IconGithub } from "../icons/icon-github";
import { IconTwitter } from "../icons/icon-twitter";
import { IconWhatsapp } from "../icons/icon-whatsapp";
import { IconEmail } from "../icons/icon-email";

const platformIcons: Record<SocialPlatform, React.FC<IconProps>> = {
  instagram: IconInstagram,
  tiktok: IconTiktok,
  linkedin: IconLinkedin,
  snapchat: IconSnapchat,
  telegram: IconTelegram,
  youtube: IconYoutube,
  github: IconGithub,
  x: IconTwitter,
  whatsapp: IconWhatsapp,
  email: IconEmail,
};

export default function SocialLinkButton({
  platform,
  label,
  handle,
  href,
  followers,
  comingSoon,
}: SocialLink) {
  const Icon = platformIcons[platform];

  const content = (
    <>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon width={24} height={24} />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block font-semibold text-neutral-100">{label}</span>
        {handle && (
          <span className="block truncate text-sm text-neutral-50">
            {handle}
          </span>
        )}
      </span>
    </>
  );

  const baseClassName =
    "flex w-full items-center gap-3 rounded-lg border border-neutral-20 bg-white py-3 pl-3 pr-4";

  if (comingSoon) {
    return (
      <div className={`${baseClassName} opacity-60`} aria-disabled="true">
        {content}
        <span className="rounded-full bg-neutral-10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-60">
          Soon
        </span>
      </div>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group ${baseClassName} transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_6px_20px_rgba(230,57,70,0.12)]`}
      {...eventAttributes(DYNAMIC_EVENTS.socialClick(platform, "links"), {
        platform: label,
        location: "links",
      })}
    >
      {content}
      {followers !== undefined && (
        <span
          className="shrink-0 text-sm font-semibold text-neutral-80"
          title={`${followers.toLocaleString("en")} followers`}
        >
          {` + ${formatCompact(followers)}`}
        </span>
      )}
      <ArrowUpRight className="size-4 shrink-0 text-neutral-30 transition-colors group-hover:text-primary" />
    </a>
  );
}
