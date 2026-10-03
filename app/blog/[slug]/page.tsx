import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogShell from "@/components/blog/blog-shell";
import PostList from "@/components/blog/post-list";
import PostMeta from "@/components/blog/post-meta";
import SectionTitle from "@/components/blog/section-title";
import { IconInstagram } from "@/components/icons/icon-instagram";
import { DYNAMIC_EVENTS, eventAttributes } from "@/lib/analytics";
import { getAllPosts, getPost, getPostsByCategory } from "@/lib/blog";

export const revalidate = 86400;
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      locale: "ar",
      publishedTime: post.date,
      images: post.cover ? [{ url: post.cover }] : undefined,
    },
  };
}

// "https://www.instagram.com/reel/DdkE4G5IkeH/" -> "DdkE4G5IkeH"
function reelId(url: string) {
  return (
    url.match(/instagram\.com\/(?:p|reel|reels)\/([^/?#]+)/)?.[1] ?? "unknown"
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const related = getPostsByCategory(post.category.slug)
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  return (
    <BlogShell activeCategory={post.category.slug}>
      <article className="flex min-w-0 flex-col gap-8">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-sm text-neutral-50"
        >
          <Link href="/blog" className="hover:text-primary">
            Blog
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href={`/blog/category/${post.category.slug}`}
            className="hover:text-primary"
          >
            {post.category.label}
          </Link>
        </nav>

        {/* Right to left like the article cards: meta (English), title, summary, reel button */}
        <header dir="rtl" className="flex flex-col gap-4">
          <PostMeta post={post} linkCategory />
          <h1
            dir="auto"
            className="text-right font-arabic text-3xl font-bold leading-tight text-neutral-100 md:text-4xl"
          >
            {post.title}
          </h1>
          <p
            dir="auto"
            className="text-right font-arabic text-lg leading-relaxed text-neutral-70"
          >
            {post.description}
          </p>
          {post.reel && (
            <a
              href={post.reel}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-lg border border-primary px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
              {...eventAttributes(DYNAMIC_EVENTS.reelClick(reelId(post.reel)), {
                reel: reelId(post.reel),
                location: "blog-article",
              })}
            >
              <IconInstagram width={18} height={18} />
              Watch the reel
            </a>
          )}
        </header>

        {post.cover && (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-neutral-10">
            <Image
              src={post.cover}
              alt=""
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 760px"
              className="object-cover"
            />
          </div>
        )}

        <div
          dir="rtl"
          lang="ar"
          className="blog-article prose prose-lg max-w-none font-arabic prose-headings:font-semibold prose-headings:text-neutral-100 prose-p:text-neutral-90 prose-li:text-neutral-90 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-neutral-100 prose-blockquote:border-primary prose-blockquote:font-normal prose-blockquote:not-italic prose-blockquote:text-neutral-80 prose-code:rounded prose-code:bg-neutral-5 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-normal prose-code:text-neutral-100 prose-code:before:content-none prose-code:after:content-none prose-pre:bg-neutral-100 prose-pre:text-white prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        <div className="flex flex-col gap-6 border-t border-neutral-10 pt-8">
          {related.length > 0 && (
            <section className="flex flex-col gap-5">
              <SectionTitle label={`More in ${post.category.label}`} />
              <PostList posts={related} />
            </section>
          )}
          <Link
            href="/blog"
            className="flex w-fit items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            {/* Back = arrow pointing right in a right-to-left page */}
            <span aria-hidden="true">→</span>
            <span>All articles</span>
          </Link>
        </div>
      </article>
    </BlogShell>
  );
}
