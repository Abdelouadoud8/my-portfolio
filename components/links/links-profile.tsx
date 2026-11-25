import React from "react";
import Image from "next/image";
import { LinksProfile as LinksProfileProps } from "@/data/types";

// The bio line is hidden since 2026-11-25 (owner request); its texts stay in lib/i18n.ts to bring it back
export default function LinksProfile({ name, tagline, imageUrl }: LinksProfileProps) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <Image
        src={imageUrl}
        alt={name}
        width={96}
        height={96}
        priority
        // Already a small WebP (data/links/links.ts): served as is, no Image Optimization
        unoptimized
        className="size-24 rounded-full object-cover ring-4 ring-primary/15"
      />
      <div>
        <h1 className="text-2xl font-semibold text-neutral-100">{name}</h1>
        <p className="mt-1 text-sm font-bold uppercase tracking-wide text-primary">{tagline}</p>
      </div>
    </div>
  );
}
