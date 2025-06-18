import React from "react";
import { Button } from "../ui/button";
import { IconOpenInNewTab } from "../icons/icon-open-new-tab";

type ProjectHeaderProps = {
  title: string;
  subtitle: string;
  role: string;
  description: string;
  link?: string;
};

export default function ProjectHeader({
  title,
  subtitle,
  role,
  description,
  link,
}: ProjectHeaderProps) {
  return (
    <div>
      <span className="text-[1rem] uppercase font-semibold text-neutral-40">
        {role}
      </span>
      <h1 className="mb-4 sm:mb-0leading-14 sm:leading-18 text-[2.5rem] sm:text-[3.5rem] font-bold text-primary-50 ">
        {title}
      </h1>
      <h2 className="text-[1.3rem] sm:text-[1.5rem] font-medium text-neutral-100">
        {subtitle}
      </h2>
      <p className="text-[1rem] font-normal text-neutral-60 mt-[0.5rem] leading-[1.5rem]">
        {description}
      </p>
      {link && (
        <a href={link} target="_blank">
          <Button className="mt-4">
            View live website <IconOpenInNewTab className=" text-white" />
          </Button>
        </a>
      )}
    </div>
  );
}
