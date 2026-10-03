import CollaborateButton from "@/components/links/collaborate-button";
import ReelCard from "@/components/links/reel-card";
import SocialLinkButton from "@/components/links/social-link-button";
import { collaboration, featuredReels } from "@/data/links";
import type { SocialLink } from "@/data/types";

// Reels are listed one under the other, as horizontal cards (thumbnail + details)
const MAX_SIDEBAR_REELS = 3;

type FollowSectionProps = {
  socials: SocialLink[];
  location: string;
};

// Compact version of the /links content for the blog sidebar: socials, collaborate button, up to 3 reels
export default function FollowSection({
  socials,
  location,
}: FollowSectionProps) {
  const reels = featuredReels.slice(0, MAX_SIDEBAR_REELS);

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <p className="text-xs font-bold uppercase tracking-wide text-neutral-50">
          Follow me
        </p>
        <div className="flex flex-col gap-2">
          {socials.map((link) => (
            <SocialLinkButton
              key={link.platform}
              {...link}
              location={location}
              compact
            />
          ))}
        </div>
        {collaboration.email && (
          <CollaborateButton
            label={collaboration.label}
            subject={collaboration.subject}
            encodedEmail={Buffer.from(collaboration.email).toString("base64")}
            location={location}
          />
        )}
      </section>

      {reels.length > 0 && (
        <section className="flex flex-col gap-3">
          <p className="text-xs font-bold uppercase tracking-wide text-neutral-50">
            Featured reels
          </p>
          <div className="flex flex-col gap-3">
            {reels.map((reel) => (
              <ReelCard
                key={reel.id}
                {...reel}
                location={location}
                layout="horizontal"
                hideComments
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
