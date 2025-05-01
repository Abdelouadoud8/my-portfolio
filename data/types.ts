type Project = {
  id: string;
  slug: string;
  title: string;
  role: string;
  subtitle: string;
  description: string;
  cover: string;
  topics: { title: string; content: string }[];
  sections: {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    images: string[];
  }[];
  quote?: {
    person: string;
    description: string;
  };
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
  elements: {
    id: string;
    title: string;
    description: string;
    dates?: string;
    link?: string;
  }[];
  className?: string;
};

export type { Project, Testimonial, TopicType };
