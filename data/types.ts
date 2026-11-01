type Project = {
  id: string;
  slug: string;
  title: string;
  role: string;
  link?: string;
  subtitle: string;
  description: string;
  coverUrl: string;
  topics: { title: string; content: string }[];
  sections: ProjectSectionType[];
  quote?: QuoteType;
};

type ProjectSectionType = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  images: string[];
};

type QuoteType = {
  author: string;
  description: string;
};

type Testimonial = {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  fullname: string;
  occupation: string;
};

type TopicType = {
  title: string;
  elements?: {
    id: string;
    title: string;
    description: string;
    dates?: string;
    link?: string;
  }[];
  content?: string;
  className?: string;
};

type SocialPlatform =
  | "instagram"
  | "tiktok"
  | "linkedin"
  | "snapchat"
  | "telegram"
  | "youtube"
  | "github"
  | "x"
  | "facebook"
  | "whatsapp"
  | "email";

type SocialLink = {
  platform: SocialPlatform;
  label: string;
  handle?: string;
  href?: string;
  followers?: number;
  comingSoon?: boolean;
};

type ReelStats = {
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
};

type FeaturedReel = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  href: string;
  tag?: string;
  stats?: ReelStats;
};

type CollaborationCta = {
  email: string;
  label: string;
  subject: string;
};

// A training / workshop: card on /links + details page at /trainings/<id>
type TrainingModule = {
  title: string;
  // e.g. "30 دقيقة"
  duration: string;
  points: string[];
};

type TrainingReview = {
  name: string;
  text: string;
  // 1 to 5
  rating?: number;
};

// One open date of a training (big cards in the "الحصص" section)
type TrainingSession = {
  // Stable id, e.g. "2026-11-28": the bot's session is "<trainingId>_<id>" (never change it once people registered)
  id: string;
  // e.g. "السبت 15 نوفمبر"
  date: string;
  // e.g. "20:00 - 22:00"
  time?: string;
  seats: number;
  seatsLeft: number;
  // Seats sold outside the Telegram bot (counted as taken by the bot's live count)
  reservedSeats?: number;
  // e.g. "1500 DA"
  price: string;
  // Price before the discount, shown struck through next to `price`
  oldPrice?: string;
  // Booking open: the "تسجيل" button opens the Telegram bot (training's telegramBot) on this session
  bookingOpen?: boolean;
  // Register link for this date that overrides the bot (e.g. a form); falls back to the training's signupHref
  signupHref?: string;
};

// "طرق الدفع" section: the icon is picked from `kind`
type TrainingPaymentMethod = {
  kind: "baridimob" | "post-office";
  title: string;
  description: string;
};

type TrainingFaq = {
  question: string;
  answer: string;
};

type Training = {
  // Also the URL: /trainings/<id>
  id: string;
  title: string;
  description?: string;
  date?: string;
  time?: string;
  // e.g. "Google Meet"
  platform?: string;
  // Details page only: every field below is optional, its block is hidden when missing/empty
  price?: string;
  level?: string;
  maxParticipants?: string; // e.g. "20-25"
  // Who it's for / what you'll be able to do / what to bring
  audience?: string[];
  outcomes?: string[];
  requirements?: string[];
  sessions?: TrainingSession[];
  // "كيفاش تسجل" steps; the section shows a "coming soon" line while empty
  registrationSteps?: string[];
  paymentMethods?: TrainingPaymentMethod[];
  program?: TrainingModule[];
  reviews?: TrainingReview[];
  faq?: TrainingFaq[];
  // "عندك سؤال؟" button (Telegram/WhatsApp chat link); block hidden when missing
  questionsHref?: string;
  // Username of the registration bot (no @), see automations/training-bot
  telegramBot?: string;
  // Sign-up form (Google Forms, Tally, ...); no href → "التسجيل يتفتح قريبا" button that isn't clickable
  signupHref?: string;
};

type LinksProfile = {
  name: string;
  tagline: string;
  bio: string;
  imageUrl: string;
};

export type {
  Project,
  ProjectSectionType,
  QuoteType,
  Testimonial,
  TopicType,
  SocialPlatform,
  SocialLink,
  FeaturedReel,
  ReelStats,
  LinksProfile,
  CollaborationCta,
  Training,
  TrainingModule,
  TrainingReview,
  TrainingSession,
  TrainingPaymentMethod,
  TrainingFaq,
};
