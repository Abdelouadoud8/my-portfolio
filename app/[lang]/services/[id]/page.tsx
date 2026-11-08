import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { services } from "@/data/services/services";
import ServicePageContent, { serviceMetadata } from "@/components/services/service-page";
import { isPrefixedLocale } from "@/lib/i18n";

// /en/services/<id> and /fr/services/<id>
export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ id: service.id }));
}

type Props = { params: Promise<{ lang: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params;
  return isPrefixedLocale(lang) ? serviceMetadata(id, lang) : {};
}

export default async function LocalizedServicePage({ params }: Props) {
  const { lang, id } = await params;
  if (!isPrefixedLocale(lang)) notFound();
  return <ServicePageContent id={id} locale={lang} />;
}
