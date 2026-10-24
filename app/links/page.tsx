import type { Metadata } from "next";
import LinksProfile from "@/components/links/links-profile";
import SocialLinkButton from "@/components/shared/social/social-link-button";
import ReelCard from "@/components/shared/social/reel-card";
import CollaborateButton from "@/components/shared/social/collaborate-button";
import TotalFollowers from "@/components/links/total-followers";
import {
  collaboration,
  featuredReels,
  linksProfile,
  linksSocials,
} from "@/data/links/links";
import { getVisibleSocials } from "@/lib/instagram-followers";
import Footer from "@/components/shared/footer";
import { sitePreviewImage } from "@/lib/link-preview";

// The Instagram bio link: without an og:image Meta's preview bot picked a reel cover (65 KB) and
// fetched it about once a minute
export const metadata: Metadata = {
  title: "Links",
  description: `${linksProfile.tagline} by ${linksProfile.name}: socials and featured reels with detailed steps.`,
  openGraph: {
    siteName: "Abdelouadoud's Portfolio",
    images: [sitePreviewImage],
    type: "website",
  },
};

// Re-read the live follower counts (public igstats/fbstats endpoints) twice a day (counts change once a day)
export const revalidate = 43200;

// Link-in-bio page. Lives outside the (site) group: no portfolio header, but keeps the footer.
export default async function LinksPage() {
  const socials = await getVisibleSocials(linksSocials);

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="flex-1 bg-[radial-gradient(70%_35%_at_50%_0%,rgba(230,57,70,0.08),transparent)]">
        <div className="mx-auto flex w-full max-w-md flex-col gap-10 px-4 pb-10 pt-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <LinksProfile {...linksProfile} />

          <TotalFollowers socials={socials} />

          {collaboration.email && (
            <CollaborateButton
              label={collaboration.label}
              subject={collaboration.subject}
              encodedEmail={Buffer.from(collaboration.email).toString("base64")}
            />
          )}

          <section aria-label="Social links" className="flex flex-col gap-3">
            {socials.map((link) => (
              <SocialLinkButton key={link.platform} {...link} />
            ))}
          </section>

          {featuredReels.length > 0 && (
            <section
              aria-labelledby="featured-reels"
              className="flex flex-col gap-4"
            >
              <h2
                id="featured-reels"
                className="text-center text-sm font-bold uppercase tracking-wide text-primary"
              >
                Featured reels
              </h2>
              <div
                className={
                  featuredReels.length === 1
                    ? "mx-auto w-1/2"
                    : "grid grid-cols-2 gap-4"
                }
              >
                {featuredReels.map((reel) => (
                  <ReelCard key={reel.id} {...reel} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
