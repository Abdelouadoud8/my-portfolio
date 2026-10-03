import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogShell from "@/components/blog/blog-shell";
import PostList from "@/components/blog/post-list";
import { blogCategories } from "@/data/blog-categories";
import { getPostsByCategory } from "@/lib/blog";

export const revalidate = 86400;
export const dynamicParams = false;

type Props = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return blogCategories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = blogCategories.find((c) => c.slug === slug);
  return category
    ? { title: category.label, description: category.description }
    : {};
}

export default async function BlogCategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = blogCategories.find((c) => c.slug === slug);
  if (!category) notFound();

  const posts = getPostsByCategory(slug);

  return (
    <BlogShell activeCategory={slug}>
      <header className="flex flex-col gap-3">
        <p className="text-sm font-bold uppercase tracking-wide text-primary">
          Category
        </p>
        <h1
          dir="auto"
          className="text-right text-3xl font-semibold text-neutral-100 md:text-4xl"
        >
          {category.label}
        </h1>
        <p dir="auto" className="max-w-2xl text-right text-neutral-70">
          {category.description}
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-20 p-8 text-center text-neutral-60">
          No articles in this category yet.
        </p>
      ) : (
        <PostList posts={posts} />
      )}
    </BlogShell>
  );
}
