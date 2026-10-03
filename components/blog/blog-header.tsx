import Link from "next/link";
import { Logo } from "../icons/logo";
import { EVENTS, eventAttributes } from "@/lib/analytics";

const navItems = [
  { title: "Links", href: "/links" },
  { title: "Portfolio", href: "/" },
];

export default function BlogHeader() {
  return (
    <header className="border-b border-neutral-10 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-5">
        <Link href="/blog" className="flex min-w-0 items-center gap-2 sm:gap-3" aria-label="Blog home">
          {/* Smaller logo on phones so logo + menu fit in 360px */}
          <Logo
            className="text-primary [&_svg]:h-auto [&_svg]:w-[112px] sm:[&_svg]:w-[160px]"
            width={160}
            height={30}
          />
          <span className="h-5 w-px bg-neutral-20 sm:h-6" />
          <span className="text-xs font-bold uppercase tracking-wide text-primary sm:text-sm">Blog</span>
        </Link>
        <nav className="flex shrink-0 items-center gap-3 sm:gap-5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-semibold uppercase text-neutral-30 transition-colors hover:text-neutral-70 sm:text-sm"
              {...eventAttributes(EVENTS.navClick, { item: item.title, location: "blog" })}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
