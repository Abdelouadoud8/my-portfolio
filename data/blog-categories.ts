// Blog categories, in sidebar order. An article uses the `slug` in its `category` front matter.
// Labels are shown in English; add or rename freely (renaming a slug changes its URL).
export type BlogCategory = {
  slug: string;
  label: string;
  description: string;
};

export const blogCategories: BlogCategory[] = [
  {
    slug: "ai-tools",
    label: "AI Tools",
    description: "Tools and apps that use AI to save you time.",
  },
  {
    slug: "chatgpt",
    label: "ChatGPT & Prompts",
    description: "Prompts and ChatGPT tricks explained step by step.",
  },
  {
    slug: "productivity",
    label: "Productivity",
    description: "Work and study smarter with simple habits and tools.",
  },
  {
    slug: "tutorials",
    label: "Tutorials",
    description: "Detailed walkthroughs of the reels, step by step.",
  },
];
