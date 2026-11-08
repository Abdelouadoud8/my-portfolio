import type { Metadata } from "next";
import { services } from "@/data/services/services";
import ServicePageContent, { serviceMetadata } from "@/components/services/service-page";

// Darja version. English and French: app/[lang]/services/[id]
export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ id: service.id }));
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return serviceMetadata(id, "ar");
}

export default async function ServicePage({ params }: Props) {
  const { id } = await params;
  return <ServicePageContent id={id} locale="ar" />;
}
