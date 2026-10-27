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
  maxParticipants?: number;
  // Who it's for / what you'll be able to do / what to bring
  audience?: string[];
  outcomes?: string[];
  requirements?: string[];
  program?: TrainingModule[];
  reviews?: TrainingReview[];
  faq?: TrainingFaq[];
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
  TrainingFaq,
};
