"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { title: "Work", href: "/" },
  { title: "About", href: "/about" },
  { title: "Testimonials", href: "/testimonials" },
  { title: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <div className="px-16 py-8 flex flex-row justify-between items-center bg-white">
      <Link href="/">
        <h1 className="text-3xl font-semibold">Abdelouadoud8</h1>
      </Link>

      <nav className="flex flex-row gap-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <p
                className={`text-base uppercase font-semibold ${
                  isActive ? "text-primary" : "text-gray-5 hover:text-gray-2"
                }`}
              >
                {item.title}
              </p>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
