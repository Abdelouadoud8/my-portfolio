import { notFound } from "next/navigation";
import { isPrefixedLocale, PREFIXED_LOCALES } from "@/lib/i18n";

// /en/… and /fr/…: English and French versions of /links and its pages (Darja keeps the plain URLs).
// Only these two values exist: every other first segment is a normal route or a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return PREFIXED_LOCALES.map((lang) => ({ lang }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ lang: string }> }>) {
  const { lang } = await params;
  if (!isPrefixedLocale(lang)) notFound();
  return children;
}
