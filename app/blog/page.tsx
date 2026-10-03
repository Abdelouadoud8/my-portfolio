import BlogShell from "@/components/blog/blog-shell";
import PostList from "@/components/blog/post-list";
import SectionTitle from "@/components/blog/section-title";
import { getAllPosts } from "@/lib/blog";

// Daily refresh for the live Instagram count in the sidebar
export const revalidate = 86400;

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <BlogShell activeCategory="all">
      <header className="flex flex-col gap-3">
        <p className="text-sm font-bold uppercase tracking-wide text-primary">
          Blog
        </p>
        <h1
          dir="auto"
          className="text-right text-3xl font-semibold text-neutral-100 md:text-4xl"
        >
          Tips & tutorials from my reels
        </h1>
        <p dir="auto" className="max-w-2xl text-right text-neutral-70">
          Everything I share on Instagram, explained step by step with the
          prompts and links you need.
        </p>
      </header>

      {posts.length === 0 && (
        <p className="rounded-lg border border-dashed border-neutral-20 p-8 text-center text-neutral-60">
          The first articles are coming soon.
        </p>
      )}


      {posts.length > 0 && (
        <section className="flex flex-col gap-3">
          <SectionTitle label="All articles" />
          <PostList posts={posts} />
        </section>
      )}
    </BlogShell>
  );
}
