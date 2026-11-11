"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { DYNAMIC_EVENTS, EVENTS, trackEvent } from "@/lib/analytics";

const scriptUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;
const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
// Optional hostname allowlist. Leave unset on Vercel so every production alias is tracked.
const domains = process.env.NEXT_PUBLIC_UMAMI_DOMAINS;
// Set automatically by Vercel ("production" | "preview" | "development"); undefined locally.
const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV;

// Tracking is off on /links (most visited page): every event wakes the Neon database behind Umami,
// and the steady trickle kept its compute awake 24/7 until the free compute hours ran out (2026-11-01).
// Set back to false to re-enable.
const DISABLE_ON_LINKS = true;
// ...except clicks on the offer card and the "منين تحب تبدا؟" rows: each one is sent straight to Umami's
// /api/send (no script, no page view), so only a click wakes the database. Country, device and browser are
// still recorded (Umami reads them from the request).
const LINKS_CLICK_EVENTS = new Set<string>([
  EVENTS.trainingDetailsClick,
  EVENTS.serviceDetailsClick,
  EVENTS.freeResourceClick,
]);

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
function useLinkTracking(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
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
  }, [enabled]);
}

// Same request the Umami script makes for an event, sent once without loading the script
function sendEvent(name: string, data: Record<string, string>) {
  if (!scriptUrl || !websiteId) return;
  const { hostname, pathname, search } = window.location;
  if (domains && !domains.split(",").map((d) => d.trim()).includes(hostname)) return;
  const payload = {
    website: websiteId,
    hostname,
    language: navigator.language,
    screen: `${window.screen.width}x${window.screen.height}`,
    title: document.title,
    url: pathname + search,
    referrer: document.referrer,
    name,
    data,
  };
  fetch(new URL("/api/send", scriptUrl), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "event", payload }),
    keepalive: true,
    credentials: "omit",
  }).catch(() => {});
}

// Paused pages: only the LINKS_CLICK_EVENTS links are tracked, read from their data-umami-event attributes
function useClickOnlyTracking(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.("[data-umami-event]");
      const name = el?.getAttribute("data-umami-event");
      if (!el || !name || !LINKS_CLICK_EVENTS.has(name)) return;
      const data: Record<string, string> = {};
      for (const { name: attr, value } of Array.from(el.attributes)) {
        if (attr.startsWith("data-umami-event-")) data[attr.slice(17)] = value;
      }
      const { source } = detectVisitSource();
      sendEvent(name, { ...data, source });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [enabled]);
}

export default function UmamiAnalytics() {
  const pathname = usePathname();
  // /links and its English/French copies (/en/links, /fr/links)
  const paused = DISABLE_ON_LINKS && /^\/((en|fr)\/)?links(\/|$)/.test(pathname ?? "");
  const production = !vercelEnv || vercelEnv === "production";
  useLinkTracking(!paused);
  useClickOnlyTracking(paused && production);

  if (paused || !scriptUrl || !websiteId) return null;
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
