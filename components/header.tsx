"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { IconMenu } from "./icons/icon-menu";
import { IconClose } from "./icons/icon-close";
import { Logo } from "./icons/logo";

const navItems = [
  { title: "Work", href: "/" },
  { title: "About", href: "/about" },
  { title: "Testimonials", href: "/testimonials" },
  { title: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white px-6 py-6 md:px-16 md:py-8">
      <div className="w-full flex flex-row justify-between items-center overflow-hidden">
        <Link href="/">
          <Logo className="text-primary" width={256} height={48} />
        </Link>

        <button
          className="md:hidden text-neutral-100 mr-1"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? (
            <IconClose className="w-6 h-6" />
          ) : (
            <IconMenu className="w-6 h-6" />
          )}
        </button>

        <nav className="hidden md:flex flex-row gap-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <p
                  className={`text-sm uppercase font-semibold ${
                    isActive
                      ? "text-black"
                      : "text-neutral-30 hover:text-neutral-70"
                  }`}
                >
                  {item.title}
                </p>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile nav dropdown */}
      {menuOpen && (
        <nav className="mt-4 flex flex-col gap-4 md:hidden">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
              >
                <p
                  className={`text-sm uppercase font-semibold ${
                    isActive
                      ? "text-black"
                      : "text-neutral-30 hover:text-neutral-70"
                  }`}
                >
                  {item.title}
                </p>
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
