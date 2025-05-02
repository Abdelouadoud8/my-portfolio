import React from "react";
import { IconQuote } from "../icons/icon-quote";
import { QuoteType } from "@/data/types";

export default function Quote({ description, author }: QuoteType) {
  return (
    <div className="flex flex-col items-center gap-8">
      <IconQuote className="text-primary-200" />
      <p className="text-neutral-100 w-full sm:w-[65%] text-center text-xl">
        {description}
      </p>
      <span className="text-base tracking-wider text-neutral-60 font-medium uppercase">
        {author}
      </span>
    </div>
  );
}
