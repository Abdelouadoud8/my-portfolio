import React from "react";
import { Button } from "../ui/button";
import { socialLinks, contacts } from "@/data/general";

export default function Trailing() {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-neutral-100 text-xl font-semibold">Social links</h1>
        <div className="flex flex-col gap-1">
          <ul className="flex flex-col gap-1">
            {socialLinks.map(({ title, href }) => (
              <li key={title}>
                <a
                  className="text-base text-neutral-40 font-semibold hover:text-primary hover:underline"
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-neutral-100 text-xl font-semibold">Reach out</h1>
        <ul className="flex flex-col gap-1">
          {contacts.map((item) => (
            <li
              className="text-base text-neutral-40 font-semibold hover:text-primary transition"
              key={item}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="self-start">
        <Button>
          <a
            href="/files/CV_MAHDAOUI_ABDELOUADOUD.pdf"
            target="_blank"
            download="CV_MAHDAOUI_ABDELOUADOUD.pdf"
          >
            Download CV
          </a>
        </Button>
      </div>
    </div>
  );
}
