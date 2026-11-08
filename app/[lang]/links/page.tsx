import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LinksPageContent, { linksMetadata } from "@/components/links/links-page";
import { isPrefixedLocale } from "@/lib/i18n";

// /en/links and /fr/links (same page as /links, in English / French)
export const revalidate = 43200;

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return isPrefixedLocale(lang) ? linksMetadata(lang) : {};
}

export default async function LocalizedLinksPage({ params }: Props) {
  const { lang } = await params;
  if (!isPrefixedLocale(lang)) notFound();
  return <LinksPageContent locale={lang} />;
}
