import type { Metadata } from "next";
import { trainings } from "@/data/trainings/trainings";
import TrainingPageContent, { trainingMetadata } from "@/components/trainings/training-page";

// Darja version. English and French: app/[lang]/trainings/[id]
export const dynamicParams = false;

// Live Instagram follower count in the trainer section, refreshed twice a day like /links (FOLLOWERS_CACHE_SECONDS)
export const revalidate = 43200;

export function generateStaticParams() {
  return trainings.map((training) => ({ id: training.id }));
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return trainingMetadata(id, "ar");
}

export default async function TrainingPage({ params }: Props) {
  const { id } = await params;
  return <TrainingPageContent id={id} locale="ar" />;
}
