type EventData = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: { track: (event: string, data?: EventData) => void };
  }
}

// Single source of truth for custom event names shown in the Umami dashboard.
export const EVENTS = {
  navClick: "nav-click",
  projectCardClick: "project-card-click",
  projectLiveSiteClick: "project-live-site-click",
  ctaClick: "cta-click",
  cvDownload: "cv-download",
  contactFormStart: "contact-form-start",
  contactFormSubmit: "contact-form-submit",
  testimonialNavigate: "testimonial-navigate",
  outboundLinkClick: "outbound-link-click",
  emailClick: "email-click",
  phoneClick: "phone-click",
  fileDownload: "file-download",
  scrollDepth: "scroll-depth",
} as const;

// "LinkedIn" -> "linkedin", "X (Twitter)" -> "x-twitter"
function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Per-item event names, so the Umami Events list is readable without opening properties.
export const DYNAMIC_EVENTS = {
  // links-instagram-click, footer-tiktok-click, about-github-click
  socialClick: (platform: string, location: string) =>
    `${toSlug(location)}-${toSlug(platform)}-click` as const,
  // reel-Dde4utyo5Jd (Instagram codes are case-sensitive, kept as-is)
  reelClick: (id: string) => `reel-${id}` as const,
  // visit-from-instagram, visit-from-google, visit-from-direct
  visitFrom: (source: string) => `visit-from-${toSlug(source)}` as const,
};

type DynamicEventName = ReturnType<
  (typeof DYNAMIC_EVENTS)[keyof typeof DYNAMIC_EVENTS]
>;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS] | DynamicEventName;

// Umami stores event names up to 50 characters
const MAX_EVENT_NAME_LENGTH = 50;

// Track from JS (form results, carousel...). No-op when Umami isn't loaded.
export function trackEvent(event: EventName, data?: EventData) {
  if (typeof window === "undefined") return;
  window.umami?.track(event.slice(0, MAX_EVENT_NAME_LENGTH), data);
}

// Declarative tracking: spread onto an <a>/<button>, Umami tracks the click itself.
// eventAttributes("cta-click", { name: "book-a-call" })
//   -> { "data-umami-event": "cta-click", "data-umami-event-name": "book-a-call" }
export function eventAttributes(
  event: EventName,
  data: Record<string, string | number> = {},
) {
  const attributes: { [key: `data-${string}`]: string } = {
    "data-umami-event": event.slice(0, MAX_EVENT_NAME_LENGTH),
  };
  for (const [key, value] of Object.entries(data)) {
    attributes[`data-umami-event-${key}`] = String(value);
  }
  return attributes;
}
