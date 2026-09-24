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
};
