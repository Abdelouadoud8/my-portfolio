import Link from "next/link";

type CategoryNavProps = {
  categories: { slug: string; label: string; count: number }[];
  total: number;
  // "all" for /blog, otherwise the category slug
  active: string;
};

// Vertical tabs on desktop, horizontally scrollable chips on mobile
export default function CategoryNav({
  categories,
  total,
  active,
}: CategoryNavProps) {
  const items = [
    { slug: "all", label: "All articles", count: total, href: "/blog" },
    ...categories.map((c) => ({ ...c, href: `/blog/category/${c.slug}` })),
  ];

  return (
    <nav aria-label="Categories">
      <p className="mb-3 hidden text-xs font-bold uppercase tracking-wide text-neutral-50 lg:block">
        Categories
      </p>
      <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0">
        {items.map((item) => {
          const isActive = item.slug === active;
          return (
            <li key={item.slug} className="shrink-0">
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center justify-between gap-3 rounded-full border px-4 py-2 text-sm font-semibold transition-colors lg:rounded-md lg:border-0 lg:border-s-2 lg:px-3 ${
                  isActive
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-neutral-20 text-neutral-70 hover:bg-neutral-5 hover:text-neutral-100 lg:border-transparent"
                }`}
              >
                <span className="whitespace-nowrap">{item.label}</span>
                <span
                  className={`text-xs ${isActive ? "text-primary" : "text-neutral-40"}`}
                >
                  {item.count}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
