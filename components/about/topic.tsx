import React from "react";

export type TopicProps = {
  title: string;
  elements: {
    id: string;
    title: string;
    description: string;
    dates?: string;
    link?: string;
  }[];
  className?: string;
};

export default function Topic({ title, elements, className }: TopicProps) {
  return (
    <div className={className}>
      <h1 className="text-sm uppercase font-semibold tracking-wide">{title}</h1>
      <div className="w-12 h-[4px] bg-secondary" />
      <div className="flex flex-col gap-4">
        {elements.map((el) => {
          return (
            <div className="text-xs text-gray-3" key={el.id}>
              {el.link ? (
                <a
                  href={el.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold hover:text-secondary hover:underline"
                >
                  {el.title}
                </a>
              ) : (
                <p className="font-semibold">{el.title}</p>
              )}
              <p className="mt-1">{el.description}</p>
              {el.dates && <p className="mt-1 italic">{el.dates}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
