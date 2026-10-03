import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeExternalLinks from "rehype-external-links";
import rehypeStringify from "rehype-stringify";
import { blogCategories, type BlogCategory } from "@/data/blog-categories";

// Articles are Markdown files in content/blog/<slug>.md (file name = URL).
// Files starting with "_" (like _template.md) are ignored.
const BLOG_DIR = path.join(process.cwd(), "content/blog");

// Drafts are visible in `npm run dev` (or with BLOG_SHOW_DRAFTS=1), never in production builds
const SHOW_DRAFTS =
  process.env.NODE_ENV === "development" || process.env.BLOG_SHOW_DRAFTS === "1";

export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  category: BlogCategory;
  date: string;
  cover?: string;
  reel?: string;
  keyword?: string;
  draft: boolean;
  readingMinutes: number;
};

export type BlogPost = BlogPostMeta & { html: string };

function readingMinutes(markdown: string) {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function parseFile(fileName: string): { meta: BlogPostMeta; content: string } {
  const slug = fileName.replace(/\.md$/, "");
  const { data, content } = matter(fs.readFileSync(path.join(BLOG_DIR, fileName), "utf8"));

  const fail = (message: string) => {
    throw new Error(`content/blog/${fileName}: ${message}`);
  };
  if (!data.title) fail('missing "title"');
  if (!data.description) fail('missing "description"');
  if (!data.date) fail('missing "date" (YYYY-MM-DD)');
  const category = blogCategories.find((c) => c.slug === data.category);
  if (!category) {
    fail(
      `unknown category "${data.category}". Use one of: ${blogCategories
        .map((c) => c.slug)
        .join(", ")} (see data/blog-categories.ts)`
    );
  }

  const date =
    data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date);

  return {
    meta: {
      slug,
      title: String(data.title),
      description: String(data.description),
      category: category!,
      date,
      cover: data.cover ? String(data.cover) : undefined,
      reel: data.reel ? String(data.reel) : undefined,
      keyword: data.keyword ? String(data.keyword) : undefined,
      draft: data.draft === true,
      readingMinutes: readingMinutes(content),
    },
    content,
  };
}

function postFiles() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
}

// Newest first
export function getAllPosts(): BlogPostMeta[] {
  return postFiles()
    .map((file) => parseFile(file).meta)
    .filter((post) => SHOW_DRAFTS || !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostsByCategory(slug: string) {
  return getAllPosts().filter((post) => post.category.slug === slug);
}

// Categories with their article count (empty ones included, so the sidebar stays stable)
export function getCategoriesWithCounts() {
  const posts = getAllPosts();
  return blogCategories.map((category) => ({
    ...category,
    count: posts.filter((post) => post.category.slug === category.slug).length,
  }));
}

export async function getPost(slug: string): Promise<BlogPost | undefined> {
  const file = `${slug}.md`;
  if (!postFiles().includes(file)) return undefined;
  const { meta, content } = parseFile(file);
  if (meta.draft && !SHOW_DRAFTS) return undefined;

  // Content is written by the site owner, so rendering the HTML is safe
  const html = String(
    await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeSlug)
      .use(rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] })
      .use(rehypeStringify)
      .process(content)
  );

  return { ...meta, html };
}

export function formatPostDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
