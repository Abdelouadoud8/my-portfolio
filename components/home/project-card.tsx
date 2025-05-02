import React from "react";
import Image from "next/image";
import Link from "next/link";

type ProjectCardProps = {
  coverUrl: string;
  title: string;
  role: string;
  slug: string;
};

export default function ProjectCard({
  title,
  role,
  coverUrl,
  slug,
}: ProjectCardProps) {
  return (
    <div className="group relative w-full max-w-[47rem] h-[16rem] sm:h-[14rem] lg:h-[16rem] overflow-hidden transition-all duration-300 ease-out">
      <Link href={`/projects/${slug}`} className="block w-full h-full relative">
        <Image
          src={coverUrl}
          alt={title}
          fill
          className="object-cover w-full h-full transition-all duration-300 ease-out"
        />

        <div className="absolute inset-0 group-hover:bg-black/70 transition-all duration-300 ease-out flex items-end p-6">
          <div className="text-white opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
            <h1 className="text-xl md:text-xl font-medium mb-3">{title}</h1>
            <div className="w-8 h-1 bg-primary mb-4" />
            <p className="text-sm uppercase tracking-wide text-gray-4">
              {role}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
