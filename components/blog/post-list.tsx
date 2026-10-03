import type { BlogPostMeta } from "@/lib/blog";
import PostCard from "./post-card";

// List of compact article rows (light red cards)
export default function PostList({
  posts,
  startIndex = 1,
}: {
  posts: BlogPostMeta[];
  startIndex?: number;
}) {
  return (
    <ul className="flex flex-col gap-2">
      {posts.map((post, i) => (
        <li key={post.slug}>
          <PostCard post={post} index={startIndex + i} />
        </li>
      ))}
    </ul>
  );
}
