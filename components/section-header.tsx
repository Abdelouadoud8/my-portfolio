import React from "react";

type SectionHeaderProps = {
  title: string;
  subtitle: string;
};

export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="text-center">
      <div className="inline-block w-full md:w-5/8">
        <h2 className="text-base mb-2 font-semibold text-primary uppercase">
          {subtitle}
        </h2>
        <h1 className="text-3xl leading-12 md:text-4xl text-neutral-100 font-semibold">
          {title}
        </h1>
      </div>
    </div>
  );
}
