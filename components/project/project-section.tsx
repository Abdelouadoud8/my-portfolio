import { ProjectSectionType } from "@/data/types";
import React from "react";

export default function ProjectSection({
  id,
  title,
  subtitle,
  description,
  images,
}: ProjectSectionType) {
  return (
    <div key={id}>
      <div className="mt-12 space-y-2">
        <span className="font-bold text-neutral-10 text-[4rem]">
          {Number(id) < 10 ? `0${id}` : id}
        </span>
        <h1 className="text-[1rem] uppercase text-neutral-50 tracking-[3px] font-semibold">
          {title}
        </h1>
        <h2 className="text-[1.5rem] font-medium text-neutral-100">
          {subtitle}
        </h2>

        <p className="text-[0.9rem] leading-6 text-neutral-70 w-full">
          {description}
        </p>

        <div className="space-y-16 sm:space-y-8 mt-16">
          {images.map((image, index) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={index}
              src={image}
              alt="Details"
              className="w-full h-auto object-cover"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
