import Link from "next/link";
import type { BlogPostMeta } from "@/lib/blog";
import PostMeta from "./post-meta";

type PostCardProps = {
  post: BlogPostMeta;
  // Position in the list, shown as 01, 02…
  index: number;
};

// Compact list row (no cover), laid out right to left for the Arabic audience:
// number on the right, then meta (English), title and summary, arrow pointing left
export default function PostCard({
  post,
  index,
}: PostCardProps) {
  return (
    <Link
      dir="rtl"
      href={`/blog/${post.slug}`}
      className={`group grid grid-cols-[auto_1fr_auto] items-start gap-x-4 rounded-lg px-4 py-5 transition-colors sm:gap-x-6 ${
        "bg-primary/5 hover:bg-primary/10"
      }`}
    >
      <span className="pt-0.5 text-sm font-bold tabular-nums text-neutral-30 group-hover:text-primary">
        {String(index).padStart(2, "0")}
      </span>
      <div className="flex min-w-0 flex-col gap-2">
        <PostMeta post={post} />
        <h3
          dir="auto"
          className="text-right font-arabic text-lg font-semibold leading-snug text-neutral-100 group-hover:text-primary sm:text-xl"
        >
          {post.title}
        </h3>
        <p
          dir="auto"
          className="line-clamp-2 text-right font-arabic text-sm leading-relaxed text-neutral-60"
        >
          {post.description}
        </p>
      </div>
      <span
        aria-hidden="true"
        className="pt-0.5 text-lg text-neutral-30 transition-transform group-hover:-translate-x-1 group-hover:text-primary"
      >
        ←
      </span>
    </Link>
  );
}
