import LinksPageContent, { linksMetadata } from "@/components/links/links-page";

// Darja version (the Instagram bio link). English and French: app/[lang]/links
export const metadata = linksMetadata("ar");

// Re-read the live follower counts (public igstats/fbstats endpoints) twice a day (counts change once a day)
export const revalidate = 43200;

export default function LinksPage() {
  return <LinksPageContent locale="ar" />;
}
