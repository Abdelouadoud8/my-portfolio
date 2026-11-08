import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import LinksProfile from "@/components/links/links-profile";
import TrainingCard from "@/components/links/training-card";
import CollaborateButton from "@/components/shared/social/collaborate-button";
import TotalFollowers from "@/components/links/total-followers";
import StartPaths from "@/components/links/start-paths";
import SiteHeader from "@/components/links/site-header";
import { collaboration, linksProfile, linksSocials } from "@/data/links/links";
import { trainings } from "@/data/trainings/trainings";
import { getVisibleSocials } from "@/lib/instagram-followers";
import { withLiveSeats } from "@/lib/trainings";
import { localizeSessions, localizeTraining } from "@/lib/localize";
import { languageAlternates, localeMeta, localePaths, ui, type Locale } from "@/lib/i18n";
import Footer from "@/components/shared/footer";
import { sitePreviewImage } from "@/lib/link-preview";

// The Instagram bio link: without an og:image Meta's preview bot picked a reel cover (65 KB) and
// fetched it about once a minute
export function linksMetadata(locale: Locale): Metadata {
  return {
    title: "Links",
    description: `${ui[locale].links.tagline} by ${linksProfile.name}: socials, AI training, 1:1 calls and AI automation for companies.`,
    alternates: languageAlternates("/links"),
    openGraph: {
      siteName: "Abdelouadoud's Portfolio",
      images: [sitePreviewImage],
      type: "website",
      locale: localeMeta[locale].ogLocale,
    },
  };
}

// Darja sections: Plus Jakarta Sans has no Arabic glyphs (the header's "دارجة" link uses it in every language)
const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

// Link-in-bio page in one language (/links = Darja, /en/links, /fr/links). Violet accent: .theme-links in
// app/index.css. Outside the (portfolio) group: no portfolio header, its own header, keeps the footer.
export default async function LinksPageContent({ locale }: { locale: Locale }) {
  const t = ui[locale];
  const socials = await getVisibleSocials(linksSocials);
  // Each training with its sessions' live seats (from the registration bot once it's set), in the page's language
  const trainingsWithSessions = await Promise.all(
    trainings.map(async (training) => ({
      training: localizeTraining(training, locale),
      sessions: localizeSessions(await withLiveSeats(training), locale),
    })),
  );
  const mainTraining = trainings[0];
  const textFont = locale === "ar" ? "font-arabic" : "";

  return (
    <div lang={localeMeta[locale].lang} className={`${arabic.variable} theme-links flex min-h-dvh flex-col`}>
      <SiteHeader
        locale={locale}
        paths={localePaths("/links")}
        active="links"
        trainingId={mainTraining?.id}
      />
      <main className="flex-1 bg-[radial-gradient(70%_35%_at_50%_0%,color-mix(in_srgb,var(--color-primary)_8%,transparent),transparent)]">
        <div className="mx-auto flex w-full max-w-md flex-col gap-10 px-4 pb-10 pt-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <LinksProfile {...linksProfile} tagline={t.links.tagline} bio={t.links.bio} />

          <TotalFollowers socials={socials} label={t.links.followersLabel} />

          {collaboration.email && (
            <CollaborateButton
              label={collaboration.label}
              subject={collaboration.subject}
              encodedEmail={Buffer.from(collaboration.email).toString("base64")}
            />
          )}

          {/* The group training (next session); the services (1:1, companies) are rows of "منين تحب تبدا؟" */}
          {trainingsWithSessions.length > 0 && (
            <section aria-labelledby="trainings" className={`flex flex-col gap-4 ${textFont}`}>
              <h2 id="trainings" className="text-center text-base font-bold text-neutral-100">
                {t.links.trainings}
              </h2>
              {trainingsWithSessions.map(({ training, sessions }) => (
                <TrainingCard key={training.id} training={training} sessions={sessions} locale={locale} />
              ))}
            </section>
          )}

          {/* After the offers: pick a path (training, 1:1, companies, a question) */}
          <div className={textFont}>
            {/* No "question on Telegram" row on /links: too much spam (the training page keeps its question block) */}
            <StartPaths locale={locale} trainingId={mainTraining?.id} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
