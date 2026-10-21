"use client";

import { Mail } from "lucide-react";
import { EVENTS, trackEvent } from "@/lib/analytics";

type CollaborateButtonProps = {
  label: string;
  subject: string;
  // Base64 of the email address, so it never appears in the page HTML
  encodedEmail: string;
  location?: string;
};

export default function CollaborateButton({
  label,
  subject,
  encodedEmail,
  location = "links",
}: CollaborateButtonProps) {
  const handleClick = () => {
    trackEvent(EVENTS.collaborateClick, { location });
    const email = atob(encodedEmail);
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3.5 font-semibold text-white shadow-[0_6px_20px_rgba(230,57,70,0.25)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-primary-600 cursor-pointer"
    >
      <Mail className="size-5" />
      {label}
    </button>
  );
}
