import { TopicType } from "@/data/types";
import React from "react";

export default function Topic({
  title,
  content,
  elements,
  className,
}: TopicType) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <h1 className="text-neutral-100 text-sm uppercase font-semibold tracking-wide">
        {title}
      </h1>
      <div className="w-12 h-[4px] bg-primary" />
      <div className="flex flex-col gap-4">
        {elements ? (
          elements.map((el) => {
            return (
              <div className="text-xs" key={el.id}>
                {el.link ? (
                  <a
                    href={el.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold hover:text-primary hover:underline text-neutral-60"
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
          })
        ) : (
          <p className="mt-1 text-xs font-medium text-neutral-60">{content}</p>
        )}
      </div>
    </div>
  );
}
