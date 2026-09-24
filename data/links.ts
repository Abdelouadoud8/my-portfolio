import { FeaturedReel, LinksProfile, SocialLink } from "./types";

// Content of the /links page (link in bio). Edit this file only, the page updates itself.

export const linksProfile: LinksProfile = {
  name: "Abdelouadoud Mahdaoui",
  tagline: "Content Creator",
  bio: "Salem 👋 Ana Ouadoud, a software engineer living in France and a tech content creator.",
  imageUrl: "/homepicture.jpg",
};

// Order here = order on the page.
// - A link without `href` is hidden (fill it in to show it).
// - `comingSoon: true` shows a greyed "Soon" item that isn't clickable.
// - `followers` is shown compact on the right (6606 -> 6.6K); leave it out to hide it.
//   Update by hand from time to time (last update: 2026-09-24).
export const linksSocials: SocialLink[] = [
  {
    platform: "instagram",
    label: "Instagram",
    handle: "@abdelouadoud.mahdaoui",
    href: "https://www.instagram.com/abdelouadoud.mahdaoui/",
    followers: 8383,
  },
  {
    platform: "tiktok",
    label: "TikTok",
    handle: "@abdelouadoud_8",
    href: "https://www.tiktok.com/@abdelouadoud_8",
    followers: 337,
  },
  {
    platform: "snapchat",
    label: "Snapchat",
    handle: "@abdelwadoud_8",
    href: "https://www.snapchat.com/@abdelwadoud_8",
    followers: 404,
  },
  {
    platform: "linkedin",
    label: "LinkedIn",
    handle: "Abdelouadoud Mahdaoui",
    href: "https://www.linkedin.com/in/abdelouadoud-mahdaoui/",
    followers: 1176,
  },
  // Not launched yet: add the href to show them (or `comingSoon: true` for a "Soon" badge)
  { platform: "telegram", label: "Telegram" },
  { platform: "youtube", label: "YouTube" },
];

// Newest first. Put thumbnails in public/img/reels/ (portrait 9:16, e.g. 720x1280).
// `stats` are optional, each one is hidden when missing (views/shares are only in your Instagram insights).
// `href` = the Instagram reel, or later the blog post with the detailed steps.
// The section is hidden while this list is empty.
export const featuredReels: FeaturedReel[] = [
  {
    id: "Dde4utyo5Jd",
    title: "إختصارات لازم أي طالب يعرفها",
    description: "4 إختصارات chatgpt راح تبدلك طريقة دراستك",
    imageUrl: "/img/reels/Dde4utyo5Jd.png",
    href: "https://www.instagram.com/p/Dde4utyo5Jd/",
    tag: "AI",
    stats: { views: 277000, likes: 5607, comments: 2402 },
  },
  {
    id: "DdkE4G5IkeH",
    title: "واش يعرف chatgpt عليك",
    description: "جرب هاذ الصورة مع البرومبت و بارطاجي معانا النتيجة تاعك",
    imageUrl: "/img/reels/HSeqknYXYAAqWxd.png",
    href: "https://www.instagram.com/reel/DdkE4G5IkeH/",
    tag: "AI",
    stats: { views: 88300, likes: 2911, comments: 135 },
  },
];
