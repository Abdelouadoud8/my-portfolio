import React from "react";

type PrimaryButtonProps = {
  text?: string;
  link?: string;
  target?: string;
  download?: string;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  type?: "button" | "submit" | "reset";
};

export default function PrimaryButton({
  text,
  link,
  target = "_self",
  download,
  className,
  onClick,
  children,
  type = "button",
}: PrimaryButtonProps) {
  const baseStyle =
    "px-6 py-3 bg-secondary text-white hover:bg-secondary-dark cursor-pointer transition";

  if (link) {
    return (
      <a
        href={link}
        target={target}
        download={download}
        className={`${baseStyle} ${className || ""}`}
      >
        {children || text}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      type={type}
      className={`${baseStyle} ${className || ""}`}
    >
      {children || text}
    </button>
  );
}
