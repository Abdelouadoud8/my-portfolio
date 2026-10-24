// Link preview (OpenGraph) image shared by the home page, the blog and /links: the profile photo at
// 256px (11 KB static file, no image optimization). Pages without an og:image let Facebook/WhatsApp
// pick any image on the page (reel covers), and Meta's preview bot re-fetches it very often, so it
// must stay small.
export const sitePreviewImage = {
  url: "https://abdelouadoud-portfolio.vercel.app/shared/preview.jpg",
  width: 256,
  height: 256,
  alt: "Abdelouadoud Mahdaoui",
};
