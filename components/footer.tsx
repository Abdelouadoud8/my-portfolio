"use client";

import { IconGithub } from "./icons/icon-github";
import { IconEmail } from "./icons/icon-email";
import { IconInstagram } from "./icons/icon-instagram";
import { IconLinkedin } from "./icons/icon-linkedin";

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
      href: "mailto:abdelouadoud.mahdaoui@gmail.com",
      icon: IconEmail,
      title: "Email",
    },
  ];

  return (
    <footer className="fixed bottom-0 w-full bg-white px-12 py-6 flex flex-col md:flex-row justify-between items-center z-40 text-sm text-primary shadow-top-light">
      <p className="text-center md:text-left">
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
            <Icon width={20} height={20} />
          </a>
        ))}
      </div>
    </footer>
  );
}
