import { linksSocials } from "@/data/links";
import { getAllPosts, getCategoriesWithCounts } from "@/lib/blog";
import { getVisibleSocials } from "@/lib/instagram-followers";
import CategoryNav from "./category-nav";
import FollowSection from "./follow-section";

// Blog page frame, right to left (most readers are Arabic speakers): first column (on the right) =
// categories + "Follow me" (links, collaborate, reels), then the content. English text is right-aligned too.
// On mobile the categories stay on top and "Follow me" moves below the content.
export default async function BlogShell({
  activeCategory,
  children,
}: {
  activeCategory: string;
  children: React.ReactNode;
}) {
  const socials = await getVisibleSocials(linksSocials);
  const follow = <FollowSection socials={socials} location="blog" />;

  return (
    <div
      dir="rtl"
      className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[250px_1fr] lg:gap-14"
    >
      <aside className="flex min-w-0 flex-col gap-10">
        <CategoryNav
          categories={getCategoriesWithCounts()}
          total={getAllPosts().length}
          active={activeCategory}
        />
        <div className="hidden lg:block">{follow}</div>
      </aside>

      <div className="flex min-w-0 flex-col gap-12">
        {children}
        <div className="border-t border-neutral-10 pt-10 lg:hidden">
          {follow}
        </div>
      </div>
    </div>
  );
}
