import GeneralDetails from "@/components/about/general-details";
import Topic from "@/components/about/topic";
import Trailing from "@/components/about/trailing";
import { topics } from "@/data/topics";
import React from "react";

export default function About() {
  const divider = <div className="w-full h-[2px] bg-neutral-10 my-16" />;

  return (
    <div>
      <GeneralDetails />
      {divider}
      <div className="my-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {topics.map((topic) => {
          return (
            <Topic
              className="flex flex-col gap-2"
              title={topic.title}
              elements={topic.elements}
              key={topic.title}
            />
          );
        })}
      </div>
      {divider}
      <Trailing />
    </div>
  );
}
