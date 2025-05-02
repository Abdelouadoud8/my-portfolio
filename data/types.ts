type Project = {
  id: string;
  slug: string;
  title: string;
  role: string;
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

export type { Project, ProjectSectionType, QuoteType, Testimonial, TopicType };
