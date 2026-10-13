import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogShell from "@/components/blog/blog-shell";
import PostList from "@/components/blog/post-list";
import { blogCategories } from "@/data/blog-categories";
import { getPostsByCategory } from "@/lib/blog";

// Re-read the live follower counts (public igstats/fbstats endpoints) at most every 15 minutes
export const revalidate = 900;
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
        <p className="font-arabic text-sm font-bold text-primary">القسم</p>
        <h1
          dir="rtl"
          className="text-right font-arabic text-3xl font-semibold text-neutral-100 md:text-4xl"
        >
          {category.label}
        </h1>
        <p dir="rtl" className="max-w-2xl text-right font-arabic text-neutral-70">
          {category.description}
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-20 p-8 text-center font-arabic text-neutral-60">
          مازال ما كاين حتى مقال في هذا القسم، ارجع قريب.
        </p>
      ) : (
        <PostList posts={posts} />
      )}
    </BlogShell>
  );
}
