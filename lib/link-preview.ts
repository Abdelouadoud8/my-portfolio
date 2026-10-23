// Link preview (OpenGraph) image shared by the home page and the blog: the profile photo at 256px
// (~10 KB). Pages without an og:image let Facebook/WhatsApp pick any image on the page (reel covers),
// and Meta's preview bot re-fetches it very often, so it must stay small.
export const sitePreviewImage = {
  url: "https://abdelouadoud-portfolio.vercel.app/_next/image?url=%2Fshared%2Fhomepicture.jpg&w=256&q=75",
  width: 256,
  height: 256,
  alt: "Abdelouadoud Mahdaoui",
};
