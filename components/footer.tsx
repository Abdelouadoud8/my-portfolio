"use client";

import Image from "next/image";

export default function Footer() {
  const thisYear = new Date();
  const iconHeight = 24;
  const socialIconsStyle = "md:w-[20px] md:h-[20px]";

  return (
    <footer className="fixed bottom-0 w-full bg-white px-12 py-6 flex flex-col md:flex-row justify-between items-center z-40 text-sm text-primary shadow-top-light">
      <p className="text-center md:text-left">
        © {thisYear.getFullYear()} Mahdaoui Abdelouadoud | Designer & Web
        Developer
      </p>

      <div className="flex gap-6 mt-4 md:mt-0 items-center">
        <a
          href="https://www.instagram.com/abdelouadoud.8/"
          target="_blank"
          rel="noreferrer"
        >
          <Image
            src="/social-media/instagram.svg"
            alt="Instagram"
            width={iconHeight}
            height={iconHeight}
            className={socialIconsStyle}
          />
        </a>
        <a
          href="https://www.linkedin.com/in/abdelouadoud-mahdaoui/"
          target="_blank"
          rel="noreferrer"
        >
          <Image
            src="/social-media/linkedin.svg"
            alt="LinkedIn"
            width={iconHeight}
            height={iconHeight}
            className={socialIconsStyle}
          />
        </a>
        <a
          href="https://github.com/Abdelouadoud8"
          target="_blank"
          rel="noreferrer"
        >
          <Image
            src="/social-media/github.svg"
            alt="GitHub"
            width={iconHeight}
            height={iconHeight}
            className={socialIconsStyle}
          />
        </a>
        <a href="mailto:abdelouadoud.mahdaoui@gmail.com">
          <Image
            src="/social-media/gmail.svg"
            alt="Gmail"
            width={iconHeight}
            height={iconHeight}
            className={socialIconsStyle}
          />
        </a>
      </div>
    </footer>
  );
}
