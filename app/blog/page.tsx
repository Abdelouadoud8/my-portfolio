import BlogShell from "@/components/blog/blog-shell";
import PostList from "@/components/blog/post-list";
import SectionTitle from "@/components/blog/section-title";
import { getAllPosts } from "@/lib/blog";

// Re-read the live follower counts (public igstats/fbstats endpoints) twice a day (counts change once a day)
export const revalidate = 43200;

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <BlogShell activeCategory="all">
      <header className="flex flex-col gap-3">
        <p className="text-sm font-bold uppercase tracking-wide text-primary">
          Blog
        </p>
        <h1
          dir="rtl"
          className="text-right font-arabic text-3xl font-semibold text-neutral-100 md:text-4xl"
        >
          نصائح وشروحات من الريلز تاعي
        </h1>
        <p dir="rtl" className="max-w-2xl text-right font-arabic text-neutral-70">
          كلش واش نشارك في Instagram، مشروح خطوة بخطوة مع البرومبتات والروابط
          اللي تحتاجهم.
        </p>
      </header>

      {posts.length === 0 && (
        <p className="rounded-lg border border-dashed border-neutral-20 p-8 text-center font-arabic text-neutral-60">
          أول المقالات جايين قريب.
        </p>
      )}


      {posts.length > 0 && (
        <section className="flex flex-col gap-3">
          <SectionTitle label="كل المقالات" />
          <PostList posts={posts} />
        </section>
      )}
    </BlogShell>
  );
}
