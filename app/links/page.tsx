import type { Metadata } from "next";
import LinksProfile from "@/components/links/links-profile";
import SocialLinkButton from "@/components/links/social-link-button";
import ReelCard from "@/components/links/reel-card";
import { featuredReels, linksProfile, linksSocials } from "@/data/links";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Links",
  description: `${linksProfile.tagline} by ${linksProfile.name}: socials and featured reels with detailed steps.`,
};

// Link-in-bio page. Lives outside the (site) group: no portfolio header, but keeps the footer.
export default function LinksPage() {
  const socials = linksSocials.filter((link) => link.comingSoon || link.href);

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="flex-1 bg-[radial-gradient(70%_35%_at_50%_0%,rgba(230,57,70,0.08),transparent)]">
        <div className="mx-auto flex w-full max-w-md flex-col gap-10 px-4 pb-10 pt-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <LinksProfile {...linksProfile} />

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
