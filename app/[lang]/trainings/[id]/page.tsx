import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { trainings } from "@/data/trainings/trainings";
import TrainingPageContent, { trainingMetadata } from "@/components/trainings/training-page";
import { isPrefixedLocale } from "@/lib/i18n";

// /en/trainings/<id> and /fr/trainings/<id>
export const dynamicParams = false;
export const revalidate = 43200;

export function generateStaticParams() {
  return trainings.map((training) => ({ id: training.id }));
}

type Props = { params: Promise<{ lang: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params;
  return isPrefixedLocale(lang) ? trainingMetadata(id, lang) : {};
}

export default async function LocalizedTrainingPage({ params }: Props) {
  const { lang, id } = await params;
  if (!isPrefixedLocale(lang)) notFound();
  return <TrainingPageContent id={id} locale={lang} />;
}
