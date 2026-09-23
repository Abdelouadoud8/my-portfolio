"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { EVENTS, trackEvent } from "@/lib/analytics";

const scriptUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;
const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
const domains = process.env.NEXT_PUBLIC_UMAMI_DOMAINS;

const SCROLL_MILESTONES = [50, 100];
const FILE_EXTENSIONS = /\.(pdf|zip|docx?|pptx?|xlsx?)$/i;

// Tracks every mailto/tel/download/external link on the site without tagging each one.
// Links that already carry data-umami-event are left to Umami itself.
function useLinkTracking() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a");
      if (!link || link.closest("[data-umami-event]")) return;

      const href = link.getAttribute("href") ?? "";
      if (href.startsWith("mailto:")) {
        trackEvent(EVENTS.emailClick, { email: href.slice(7) });
        return;
      }
      if (href.startsWith("tel:")) {
        trackEvent(EVENTS.phoneClick, { phone: href.slice(4) });
        return;
      }

      const url = new URL(link.href, window.location.href);
      if (link.hasAttribute("download") || FILE_EXTENSIONS.test(url.pathname)) {
        trackEvent(EVENTS.fileDownload, { file: url.pathname });
        return;
      }
      if (url.protocol.startsWith("http") && url.origin !== window.location.origin) {
        trackEvent(EVENTS.outboundLinkClick, {
          url: url.href,
          domain: url.hostname,
          text: (link.textContent?.trim() || link.title || "").slice(0, 100),
        });
      }
    };

    document.addEventListener("click", onClick, { capture: true });
    return () =>
      document.removeEventListener("click", onClick, { capture: true });
  }, []);
}

// Fires once per milestone per page visit.
function useScrollDepth(pathname: string) {
  useEffect(() => {
    const reached = new Set<number>();

    const onScroll = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const percent = (window.scrollY / scrollable) * 100;

      for (const milestone of SCROLL_MILESTONES) {
        if (percent >= milestone - 2 && !reached.has(milestone)) {
          reached.add(milestone);
          trackEvent(EVENTS.scrollDepth, { depth: milestone });
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);
}

export default function UmamiAnalytics() {
  const pathname = usePathname();
  useLinkTracking();
  useScrollDepth(pathname);

  if (!scriptUrl || !websiteId) return null;

  return (
    <Script
      src={scriptUrl}
      data-website-id={websiteId}
      data-domains={domains}
      strategy="afterInteractive"
    />
  );
}
