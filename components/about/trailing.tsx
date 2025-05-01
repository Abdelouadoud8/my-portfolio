import React from "react";
import PrimaryButton from "../primary-button";

const socialLinks = [
  { title: "Instagram", href: "https://www.instagram.com/abdelouadoud.8/" },
  {
    title: "Linkedin",
    href: "https://www.linkedin.com/in/abdelouadoud-mahdaoui/",
  },
  { title: "Github", href: "https://github.com/Abdelouadoud8" },
  { title: "X", href: "https://x.com/AbdElWadoud_8/" },
];

const contacts = ["+33773471197", "abdelouadoud.mahdaoui@gmail.com"];

export default function Trailing() {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-8 md:mb-20 mb-36">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold">Social links</h1>
        <div className="flex flex-col gap-1">
          <ul className="flex flex-col gap-1">
            {socialLinks.map(({ title, href }) => (
              <li key={title}>
                <a
                  className="text-base text-gray-4 font-semibold hover:text-secondary hover:underline"
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
        <h1 className="text-xl font-semibold">Reach out</h1>
        <ul className="flex flex-col gap-1">
          {contacts.map((item) => (
            <li
              className="text-base text-gray-4 font-semibold hover:text-secondary transition"
              key={item}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="self-start">
        <PrimaryButton
          link="/files/MahdaouiAbdelouadoud_CV.pdf"
          download="MahdaouiAbdelouadoud_CV.pdf"
          text="Download CV"
        />
      </div>
    </div>
  );
}
