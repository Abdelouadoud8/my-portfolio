// Blog categories, in sidebar order. An article uses the `slug` in its `category` front matter.
// Labels and descriptions are in Arabic (Darija), like the articles; add or rename freely (renaming a slug changes its URL).
export type BlogCategory = {
  slug: string;
  label: string;
  description: string;
};

export const blogCategories: BlogCategory[] = [
  {
    slug: "ai-tools",
    label: "أدوات الذكاء الاصطناعي",
    description: "أدوات وتطبيقات بالذكاء الاصطناعي يوفرولك الوقت.",
  },
  {
    slug: "chatgpt",
    label: "ChatGPT والبرومبتات",
    description: "برومبتات وحيل تاع ChatGPT مشروحة خطوة بخطوة.",
  },
  {
    slug: "productivity",
    label: "الإنتاجية",
    description: "اخدم واقرا بذكاء، بعادات وأدوات ساهلة.",
  },
  {
    slug: "tutorials",
    label: "شروحات",
    description: "شرح مفصل تاع الريلز، خطوة بخطوة.",
  },
];
