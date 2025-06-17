"use client";

import { IconGithub } from "./icons/icon-github";
import { IconEmail } from "./icons/icon-email";
import { IconInstagram } from "./icons/icon-instagram";
import { IconLinkedin } from "./icons/icon-linkedin";
import { IconTwitter } from "./icons/icon-twitter";

export default function Footer() {
  const thisYear = new Date();

  const socialLinks = [
    {
      href: "https://www.instagram.com/abdelouadoud.8/",
      icon: IconInstagram,
      title: "Instagram",
    },
    {
      href: "https://www.linkedin.com/in/abdelouadoud-mahdaoui/",
      icon: IconLinkedin,
      title: "LinkedIn",
    },
    {
      href: "https://github.com/Abdelouadoud8",
      icon: IconGithub,
      title: "GitHub",
    },
    {
      href: "https://x.com/AbdElWadoud_8/",
      icon: IconTwitter,
      title: "Twitter",
    },
    {
      href: "mailto:abdelouadoud.mahdaoui@gmail.com",
      icon: IconEmail,
      title: "Email",
    },
  ];

  return (
    <footer className="w-full bg-white px-10 py-4 lg:py-5  flex flex-col md:flex-row justify-between items-center z-40 text-sm text-neutral-100 shadow-top-light">
      <p className="text-center text-xs md:text-sm md:text-left">
        © {thisYear.getFullYear()} Mahdaoui Abdelouadoud | Web Developer & UI/UX
        Designer
      </p>

      <div className="flex gap-4 mt-4 md:mt-0 items-center">
        {socialLinks.map(({ href, icon: Icon, title }) => (
          <a
            key={title}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noreferrer" : undefined}
            title={title}
          >
            <Icon width={28} height={28} className="text-neutral-100" />
          </a>
        ))}
      </div>
    </footer>
  );
}
