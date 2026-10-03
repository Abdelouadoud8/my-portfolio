import Link from "next/link";
import { formatPostDate, type BlogPostMeta } from "@/lib/blog";

// Category tag · date · reading time (English UI). Each item is isolated as LTR so it stays readable
// inside right-to-left rows (otherwise "3 Oct 2026" renders as "Oct 2026 3").
export default function PostMeta({
  post,
  linkCategory = false,
}: {
  post: BlogPostMeta;
  linkCategory?: boolean;
}) {
  const category = (
    <bdi dir="ltr" className="font-bold uppercase tracking-wide text-primary">
      {post.category.label}
    </bdi>
  );
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-50">
      {linkCategory ? (
        <Link
          href={`/blog/category/${post.category.slug}`}
          className="hover:underline"
        >
          {category}
        </Link>
      ) : (
        category
      )}
      <span aria-hidden="true">·</span>
      <time dateTime={post.date} dir="ltr">
        {formatPostDate(post.date)}
      </time>
      <span aria-hidden="true">·</span>
      <bdi dir="ltr">{post.readingMinutes} min read</bdi>
      {post.draft && (
        <span className="rounded-full bg-neutral-10 px-2 py-0.5 font-semibold uppercase text-neutral-60">
          Draft
        </span>
      )}
    </div>
  );
}
