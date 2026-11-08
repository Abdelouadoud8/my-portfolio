// Languages of /links and its pages (training, services). Darja ("ar") is the default and keeps the plain URLs
// (/links, /trainings/<id>, /services/<id>: the Instagram bio link); English and French live under /en/… and /fr/….
// Content translations: data/trainings/translations.ts and data/services/translations.ts. Interface text: `ui` below.

export const LOCALES = ["ar", "en", "fr"] as const;
export type Locale = (typeof LOCALES)[number];
// Locales with a URL prefix (app/[lang]/…)
export const PREFIXED_LOCALES = ["en", "fr"] as const;
export type PrefixedLocale = (typeof PREFIXED_LOCALES)[number];

export function isPrefixedLocale(value: string): value is PrefixedLocale {
  return (PREFIXED_LOCALES as readonly string[]).includes(value);
}

export const localeMeta: Record<
  Locale,
  { name: string; dir: "rtl" | "ltr"; lang: string; intl: string; ogLocale: string }
> = {
  ar: { name: "الدارجة", dir: "rtl", lang: "ar-DZ", intl: "ar-DZ", ogLocale: "ar_DZ" },
  fr: { name: "Français", dir: "ltr", lang: "fr", intl: "fr-FR", ogLocale: "fr_FR" },
  en: { name: "English", dir: "ltr", lang: "en", intl: "en-GB", ogLocale: "en_GB" },
};

// "/links" → "/links" (Darja), "/en/links", "/fr/links"
export function localePath(locale: Locale, path: string) {
  return locale === "ar" ? path : `/${locale}${path}`;
}

// Same page in every language (language switcher, <link rel="alternate">)
export function localePaths(path: string): Record<Locale, string> {
  return { ar: localePath("ar", path), en: localePath("en", path), fr: localePath("fr", path) };
}

// hreflang alternates for generateMetadata
export function languageAlternates(path: string) {
  return { languages: { "ar-DZ": path, en: `/en${path}`, fr: `/fr${path}`, "x-default": path } };
}

// "2026-11-21" → "Saturday 21 November" / "Samedi 21 novembre"
export function formatDay(day: string, locale: Locale) {
  const text = new Intl.DateTimeFormat(localeMeta[locale].intl, {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  })
    .format(new Date(`${day}T00:00:00Z`))
    .replace(",", "");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const ar = {
  backToLinks: "رجوع للروابط",
  trainerName: "عبدالودود مهداوي",
  trainerBio:
    "مهندس في الإعلام الآلي متخرج من المدرسة العليا للإعلام الآلي بالجزائر وجامعة مونبلييه في فرنسا، وصانع محتوى في التكنولوجيا والذكاء الاصطناعي.",
  faq: "أسئلة متكررة",
  price: "السعر",
  insteadOf: "بدل ",
  keyFacts: "المعلومات",
  pageSections: "أقسام الصفحة",
  onThisPage: "في هاد الصفحة",
  followers: "متابع",
  full: "مكتملة",
  register: "تسجيل",
  bookingSoon: "التسجيل يتفتح قريبا",
  nextSession: "الحصة الجاية",
  seatsLeft: (n: number) => `باقي ${n} بلاصة`,
  fewSeats: (n: number) => `غير ${n} بلايص باقيين!`,
  participants: (n: number) => `${n} مشارك`,
  askOnTelegramText: "ابعثلي رسالة على تيليغرام و نجاوبك.",
  header: {
    home: "الروابط",
    training: "الدورة",
    oneToOne: "حصة 1:1",
    business: "للشركات",
    language: "اللغة",
    menu: "القائمة",
  },
  links: {
    tagline: "Content Creator",
    bio: "Salem 👋 Ana Ouadoud, a software engineer living in France and a tech & AI content creator.",
    followersLabel: "Followers across all platforms",
    trainings: "الدورات",
    liveBadge: "حصة مباشرة",
    beginners: "للمبتدئين",
    sessionPrice: "سعر الحصة",
    courseDetails: "تفاصيل الدورة",
    startTitle: "منين تحب تبدا؟",
    pathTraining: ["حاب نتعلم أساسيات الذكاء الإصطناعي", "حصة جماعية مباشرة على Google Meet · ساعتين"],
    pathOneToOne: ["حاب خطة على حسابي", "حصة خاصة أنا وأنت نشاركك فيها ونحاول نبنو خطة لتحقيق أي هدف حابه"],
    pathBusiness: ["عندي شركة و حاب نأتمت الخدمة", "تحليل، أتمتة و ذكاء اصطناعي للشركات"],
    pathQuestion: ["عندي سؤال قبل", "اكتبلي على تيليغرام و نجاوبك"],
  },
  training: {
    sessions: "الحصص",
    registration: "كيفاش تسجل",
    payment: "طرق الدفع",
    trainer: "المكوّن",
    outcomes: "واش راح تتعلم",
    program: "البرنامج",
    audience: "لمن هاد التكوين؟",
    reviews: "آراء المشاركين",
    place: "المكان",
    level: "المستوى",
    registrationSoon: "خطوات التسجيل راح تكون هنا قريبا.",
    questionTitle: "عندك سؤال؟",
    questionButton: "اسألني على تيليغرام",
    seats: "البلايص",
    left: "باقيين",
    bookCta: "سجّل في الحصة",
    reassurance:
      "التسجيل في تيليغرام: البلاصة تتحجزلك 48 ساعة، تخلّص و تبعث الوصل، و نأكدولك في أقل من 24 ساعة.",
    followersLine: "متابع يتبعو المحتوى تاعي على السوشل ميديا",
  },
  services: {
    steps: "كيفاش نخدمو",
    forWho: "لمن هادي؟",
    whoAmI: "شكون أنا",
    notFor: "ماشي ليك إذا:",
    requestFree: "الطلب بلاش. ما تخلّص والو حتى نتفاهمو على الخدمة.",
    honestly: "بصراحة: ",
    startTitle: "نبداو؟",
  },
};

export type UiStrings = typeof ar;

const en: UiStrings = {
  backToLinks: "Back to links",
  trainerName: "Abdelouadoud Mahdaoui",
  trainerBio:
    "Software engineer, graduated from the Higher National School of Computer Science (ESI) in Algiers and the University of Montpellier in France, and a tech & AI content creator.",
  faq: "FAQ",
  price: "Price",
  insteadOf: "instead of ",
  keyFacts: "Key facts",
  pageSections: "Page sections",
  onThisPage: "On this page",
  followers: "followers",
  full: "Full",
  register: "Register",
  bookingSoon: "Registration opens soon",
  nextSession: "Next session",
  seatsLeft: (n) => `${n} seats left`,
  fewSeats: (n) => `Only ${n} left!`,
  participants: (n) => `${n} seats`,
  askOnTelegramText: "Send me a message on Telegram and I'll get back to you.",
  header: {
    home: "Links",
    training: "Training",
    oneToOne: "1:1 session",
    business: "For companies",
    language: "Language",
    menu: "Menu",
  },
  links: {
    tagline: "Content Creator",
    bio: "Hi 👋 I'm Ouadoud, a software engineer living in France and a tech & AI content creator.",
    followersLabel: "Followers across all platforms",
    trainings: "Training",
    liveBadge: "Live session",
    beginners: "Beginners",
    sessionPrice: "Session price",
    courseDetails: "Course details",
    startTitle: "Where do you want to start?",
    pathTraining: ["Learn the basics of AI", "Live group session on Google Meet · 2 hours"],
    pathOneToOne: [
      "I want a plan made for me",
      "A private session, just you and me: we build a plan together to reach any goal you have",
    ],
    pathBusiness: ["I have a company and want to automate it", "Analysis, automation and AI for companies"],
    pathQuestion: ["I have a question first", "Message me on Telegram and I'll answer"],
  },
  training: {
    sessions: "Sessions",
    registration: "How to register",
    payment: "Payment methods",
    trainer: "Your trainer",
    outcomes: "What you'll learn",
    program: "Program",
    audience: "Who it's for",
    reviews: "Reviews",
    place: "Where",
    level: "Level",
    registrationSoon: "Registration steps will be here soon.",
    questionTitle: "Have a question?",
    questionButton: "Ask me on Telegram",
    seats: "Seats",
    left: "left",
    bookCta: "Book your seat",
    reassurance:
      "Registration on Telegram: your seat is held for 48 hours, you pay and send the receipt, and we confirm within 24 hours.",
    followersLine: "people follow my content on social media",
  },
  services: {
    steps: "How it works",
    forWho: "Who it's for",
    whoAmI: "Who I am",
    notFor: "Not for you if:",
    requestFree: "Asking is free. You pay nothing until we agree on the work.",
    honestly: "Honestly: ",
    startTitle: "Shall we start?",
  },
};

const fr: UiStrings = {
  backToLinks: "Retour aux liens",
  trainerName: "Abdelouadoud Mahdaoui",
  trainerBio:
    "Ingénieur en informatique, diplômé de l'École nationale supérieure d'informatique (ESI) d'Alger et de l'Université de Montpellier, et créateur de contenu tech & IA.",
  faq: "Questions fréquentes",
  price: "Prix",
  insteadOf: "au lieu de ",
  keyFacts: "Infos clés",
  pageSections: "Sections de la page",
  onThisPage: "Sur cette page",
  followers: "abonnés",
  full: "Complet",
  register: "S'inscrire",
  bookingSoon: "Inscriptions bientôt ouvertes",
  nextSession: "Prochaine session",
  seatsLeft: (n) => `${n} places libres`,
  fewSeats: (n) => `Plus que ${n} places !`,
  participants: (n) => `${n} places`,
  askOnTelegramText: "Envoie-moi un message sur Telegram et je te réponds.",
  header: {
    home: "Liens",
    training: "Formation",
    oneToOne: "Session 1:1",
    business: "Entreprises",
    language: "Langue",
    menu: "Menu",
  },
  links: {
    tagline: "Créateur de contenu",
    bio: "Salut 👋 Moi c'est Ouadoud, ingénieur logiciel installé en France et créateur de contenu tech & IA.",
    followersLabel: "Abonnés sur toutes les plateformes",
    trainings: "Formation",
    liveBadge: "Session en direct",
    beginners: "Débutants",
    sessionPrice: "Prix de la session",
    courseDetails: "Voir la formation",
    startTitle: "Par où veux-tu commencer ?",
    pathTraining: ["Apprendre les bases de l'IA", "Session de groupe en direct sur Google Meet · 2 heures"],
    pathOneToOne: [
      "Je veux un plan sur mesure",
      "Une session privée, juste toi et moi : on construit ensemble un plan pour atteindre ton objectif",
    ],
    pathBusiness: [
      "J'ai une entreprise et je veux l'automatiser",
      "Analyse, automatisation et IA pour les entreprises",
    ],
    pathQuestion: ["J'ai une question avant", "Écris-moi sur Telegram et je te réponds"],
  },
  training: {
    sessions: "Sessions",
    registration: "Comment s'inscrire",
    payment: "Moyens de paiement",
    trainer: "Ton formateur",
    outcomes: "Ce que tu vas apprendre",
    program: "Programme",
    audience: "Pour qui ?",
    reviews: "Avis",
    place: "Lieu",
    level: "Niveau",
    registrationSoon: "Les étapes d'inscription arrivent bientôt.",
    questionTitle: "Une question ?",
    questionButton: "Pose ta question sur Telegram",
    seats: "Places",
    left: "restantes",
    bookCta: "Réserver ma place",
    reassurance:
      "Inscription sur Telegram : ta place est réservée 48 heures, tu paies, tu envoies le reçu, et on confirme en moins de 24 heures.",
    followersLine: "personnes suivent mon contenu sur les réseaux",
  },
  services: {
    steps: "Comment ça marche",
    forWho: "Pour qui ?",
    whoAmI: "Qui suis-je",
    notFor: "Pas pour toi si :",
    requestFree: "La demande est gratuite. Tu ne paies rien tant qu'on n'est pas d'accord sur le travail.",
    honestly: "Honnêtement : ",
    startTitle: "On commence ?",
  },
};

export const ui: Record<Locale, UiStrings> = { ar, en, fr };
