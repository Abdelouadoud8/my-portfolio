import React from "react";

type TopicProps = {
  title: string;
  elements: { title: string; description: string }[];
  className?: string;
};

export default function Topic({ title, elements, className }: TopicProps) {
  return (
    <div className={className}>
      <h1 className="text-lg uppercase font-semibold tracking-wide">{title}</h1>
      <div className="w-12 h-[4px] bg-secondary" />
      <div className="flex flex-col gap-4">
        {elements.map((el) => {
          return (
            <div className="text-xs text-gray-3" key={el.title}>
              <span className="font-semibold">{el.title}</span>
              <p className="mt-1">{el.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
