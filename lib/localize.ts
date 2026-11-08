import type { Service, Training, TrainingSession } from "@/data/types";
import { trainingTranslations } from "@/data/trainings/translations";
import { serviceTranslations } from "@/data/services/translations";
import { formatDay, type Locale } from "@/lib/i18n";

// Training with its English/French text (Darja = the data file as is). Sessions keep their numbers.
export function localizeTraining(training: Training, locale: Locale): Training {
  if (locale === "ar") return training;
  return { ...training, ...trainingTranslations[locale][training.id] };
}

// Session dates in the page's language ("Saturday 21 November"), from each session's `day`
export function localizeSessions(sessions: TrainingSession[], locale: Locale): TrainingSession[] {
  if (locale === "ar") return sessions;
  return sessions.map((session) =>
    session.day ? { ...session, date: formatDay(session.day, locale) } : session,
  );
}

export function localizeService(service: Service, locale: Locale): Service {
  if (locale === "ar") return service;
  return { ...service, ...serviceTranslations[locale][service.id] };
}
