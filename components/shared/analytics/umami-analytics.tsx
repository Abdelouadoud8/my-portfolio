"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { DYNAMIC_EVENTS, EVENTS, trackEvent } from "@/lib/analytics";

const scriptUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;
const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
// Optional hostname allowlist. Leave unset on Vercel so every production alias is tracked.
const domains = process.env.NEXT_PUBLIC_UMAMI_DOMAINS;
// Set automatically by Vercel ("production" | "preview" | "development"); undefined locally.
const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV;

const SCROLL_MILESTONES = [50, 100];
const VISIT_SOURCE_KEY = "visit-source-tracked";

// In-app browsers (Instagram, TikTok...) usually send no referrer, but identify themselves in the user agent
const IN_APP_BROWSERS: [string, RegExp][] = [
  ["instagram", /Instagram/i],
  ["tiktok", /musical_ly|BytedanceWebview|TikTok/i],
  ["snapchat", /Snapchat/i],
  ["linkedin", /LinkedInApp/i],
  ["facebook", /FBAN|FBAV|FB_IAB|FBIOS/i],
  ["x", /Twitter/i],
];

const REFERRER_PLATFORMS: [string, RegExp][] = [
  ["instagram", /(^|\.)instagram\.com$/],
  ["tiktok", /(^|\.)tiktok\.com$/],
  ["snapchat", /(^|\.)snapchat\.com$/],
  ["linkedin", /(^|\.)(linkedin\.com|lnkd\.in)$/],
  ["facebook", /(^|\.)(facebook\.com|fb\.com)$/],
  ["x", /(^|\.)(x\.com|twitter\.com|t\.co)$/],
  ["youtube", /(^|\.)(youtube\.com|youtu\.be)$/],
  ["whatsapp", /(^|\.)(whatsapp\.com|wa\.me)$/],
  ["github", /(^|\.)github\.com$/],
  ["google", /(^|\.)google\.[a-z.]+$/],
  ["bing", /(^|\.)bing\.com$/],
];

// Where did this visit come from? utm_source > in-app browser > referrer > direct
function detectVisitSource() {
  const utmSource = new URLSearchParams(window.location.search).get(
    "utm_source",
  );
  if (utmSource) return { source: utmSource, via: "utm" };

  const userAgent = navigator.userAgent;
  for (const [source, pattern] of IN_APP_BROWSERS) {
    if (pattern.test(userAgent)) return { source, via: "in-app-browser" };
  }

  if (document.referrer) {
    const host = new URL(document.referrer).hostname.replace(/^www\./, "");
    if (host !== window.location.hostname) {
      const platform = REFERRER_PLATFORMS.find(([, pattern]) =>
        pattern.test(host),
      );
      return { source: platform ? platform[0] : host, via: "referrer" };
    }
  }

  return { source: "direct", via: "direct" };
}

// Once per browser session, right after the Umami script is ready
function trackVisitSource() {
  try {
    if (sessionStorage.getItem(VISIT_SOURCE_KEY)) return;
    sessionStorage.setItem(VISIT_SOURCE_KEY, "1");
  } catch {
    // storage blocked: still track, may repeat within the session
  }
  const { source, via } = detectVisitSource();
  trackEvent(DYNAMIC_EVENTS.visitFrom(source), {
    source,
    via,
    landing: window.location.pathname,
  });
}
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
      if (
        url.protocol.startsWith("http") &&
        url.origin !== window.location.origin
      ) {
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
  // Never count preview deployments
  if (vercelEnv && vercelEnv !== "production") return null;

  return (
    <Script
      src={scriptUrl}
      data-website-id={websiteId}
      data-domains={domains || undefined}
      strategy="afterInteractive"
      onReady={trackVisitSource}
    />
  );
}
