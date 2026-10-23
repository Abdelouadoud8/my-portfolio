import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {},
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
