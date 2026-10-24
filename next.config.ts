import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {},
  // Public files are served with max-age=0 by default, so browsers re-request every image on each
  // visit (each one counts as a CDN request). Media is replaced under a new name, so cache it 7 days;
  // PDFs keep their name when regenerated, so 1 day.
  async headers() {
    const days = (n: number) => [{ key: "Cache-Control", value: `public, max-age=${n * 86400}` }];
    return [
      { source: "/favicon.ico", headers: days(7) },
      { source: "/:dir(portfolio|shared|blog)/:file(.+\\.(?:jpg|jpeg|png|webp|gif|svg|mp4))", headers: days(7) },
      { source: "/links/reels/:path*", headers: days(7) },
      { source: "/media-kit/img/:path*", headers: days(7) },
      { source: "/portfolio/files/:path*", headers: days(1) },
      { source: "/media-kit/pdf/:path*", headers: days(1) },
    ];
  },
  // Media kit web pages are generated static files (media-kit/build.mjs → public/media-kit/*.html)
  async rewrites() {
    return [
      { source: "/media-kit", destination: "/media-kit/fr.html" },
      { source: "/media-kit/en", destination: "/media-kit/en.html" },
      { source: "/media-kit/darja", destination: "/media-kit/darja.html" },
    ];
  },
  // Old public file URLs from before public/ was split into portfolio/, links/, shared/ (Oct 2026)
  async redirects() {
    return [
      { source: "/files/:path*", destination: "/portfolio/files/:path*", permanent: true },
      { source: "/img/projects/:path*", destination: "/portfolio/projects/:path*", permanent: true },
      { source: "/img/testimonials/:path*", destination: "/portfolio/testimonials/:path*", permanent: true },
      // Reel thumbnails were 2 MB PNGs until 2026-10-24; Meta's link-preview bot still fetches the
      // old .png URLs ~1,000 times an hour, so they point at the small JPEGs (must stay above /img/reels)
      { source: "/:dir(img|links)/reels/:id([^/.]+).png", destination: "/links/reels/:id.jpg", permanent: true },
      { source: "/img/reels/:path*", destination: "/links/reels/:path*", permanent: true },
      { source: "/img/:file(about-picture.jpg|contactctabg.png)", destination: "/portfolio/:file", permanent: true },
      { source: "/mypicture2.jpeg", destination: "/portfolio/mypicture2.jpeg", permanent: true },
      { source: "/homepicture.jpg", destination: "/shared/homepicture.jpg", permanent: true },
      { source: "/logo.svg", destination: "/shared/logo.svg", permanent: true },
    ];
  },
};

export default nextConfig;
