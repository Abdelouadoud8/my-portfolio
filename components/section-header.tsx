import React from "react";

type SectionHeaderProps = {
  title: string;
  subtitle: string;
};

export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="inline-block w-4/8">
      <h2 className="text-base mb-2 font-semibold text-primary uppercase">
        {subtitle}
      </h2>
      <h1 className="text-3xl leading-12 md:text-4xl text-neutral-100 font-semibold">
        {title}
      </h1>
    </div>
  );
}

/* HEADER WITH UNDERLINE
<div className="inline-block">
  <h1 className="text-3xl md:text-4xl font-semibold">{title}</h1>
  <div className="h-[6px] bg-secondary -mt-2.5" style={{ width: "100%" }} />
</div>
*/
