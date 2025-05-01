import { TopicType } from "@/data/types";
import React from "react";

export default function Topic({ title, elements, className }: TopicType) {
  return (
    <div className={className}>
      <h1 className="text-neutral-100 text-sm uppercase font-semibold tracking-wide">
        {title}
      </h1>
      <div className="w-12 h-[4px] bg-secondary" />
      <div className="flex flex-col gap-4">
        {elements.map((el) => {
          return (
            <div className="text-xs" key={el.id}>
              {el.link ? (
                <a
                  href={el.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold hover:text-secondary hover:underline text-neutral-60"
                >
                  {el.title}
                </a>
              ) : (
                <p className="font-semibold text-neutral-60">{el.title}</p>
              )}
              <p className="mt-1 text-neutral-50">{el.description}</p>
              {el.dates && (
                <p className="mt-1 italic text-neutral-50">{el.dates}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
