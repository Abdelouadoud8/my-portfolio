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
  socialClick: "social-click",
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

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

// Track from JS (form results, carousel...). No-op when Umami isn't loaded.
export function trackEvent(event: EventName, data?: EventData) {
  if (typeof window === "undefined") return;
  window.umami?.track(event, data);
}

// Declarative tracking: spread onto an <a>/<button>, Umami tracks the click itself.
// eventAttributes("social-click", { platform: "Github" })
//   -> { "data-umami-event": "social-click", "data-umami-event-platform": "Github" }
export function eventAttributes(
  event: EventName,
  data: Record<string, string | number> = {}
) {
  const attributes: { [key: `data-${string}`]: string } = {
    "data-umami-event": event,
  };
  for (const [key, value] of Object.entries(data)) {
    attributes[`data-umami-event-${key}`] = String(value);
  }
  return attributes;
}
