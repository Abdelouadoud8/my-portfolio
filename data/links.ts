import {
  CollaborationCta,
  FeaturedReel,
  LinksProfile,
  SocialLink,
} from "./types";

// Content of the /links page (link in bio). Edit this file only, the page updates itself.

export const linksProfile: LinksProfile = {
  name: "Abdelouadoud Mahdaoui",
  tagline: "Content Creator",
  bio: "Salem 👋 Ana Ouadoud, a software engineer living in France and a tech & AI content creator.",
  imageUrl: "/homepicture.jpg",
};

export const collaboration: CollaborationCta = {
  email: "abdelouadoud.mahdaoui.pro@gmail.com",
  label: "Collaborate with me",
  subject: "Collaboration request",
};

// - `comingSoon: true` shows a greyed "Soon" item that isn't clickable.
export const linksSocials: SocialLink[] = [
  {
    platform: "instagram",
    label: "Instagram",
    handle: "@abdelouadoud.mahdaoui",
    href: "https://www.instagram.com/abdelouadoud.mahdaoui/",
    // Fallback only: /links shows the daily count from igstats (lib/instagram-followers.ts)
    followers: 11349,
  },
  {
    platform: "tiktok",
    label: "TikTok",
    handle: "@abdelouadoud_8",
    href: "https://www.tiktok.com/@abdelouadoud_8",
    followers: +1000,
  },
  // {
  //   platform: "snapchat",
  //   label: "Snapchat",
  //   handle: "@abdelwadoud_8",
  //   href: "https://www.snapchat.com/@abdelwadoud_8",
  // },
  {
    platform: "linkedin",
    label: "LinkedIn",
    handle: "Abdelouadoud Mahdaoui",
    href: "https://www.linkedin.com/in/abdelouadoud-mahdaoui/",
    followers: +1176,
  },
  {
    platform: "facebook",
    label: "Facebook",
    handle: "Abdelouadoud Mahdaoui",
    href: "https://www.facebook.com/abdelouadoud.mahdaoui",
  },
  // Not launched yet: add the href to show them (or `comingSoon: true` for a "Soon" badge)
  { platform: "telegram", label: "Telegram" },
  { platform: "youtube", label: "YouTube" },
];

export const featuredReels: FeaturedReel[] = [
  {
    id: "Dde4utyo5Jd",
    title: "إختصارات لازم أي طالب يعرفها",
    description: "4 إختصارات chatgpt راح تبدلك طريقة دراستك",
    imageUrl: "/img/reels/Dde4utyo5Jd.png",
    href: "https://www.instagram.com/p/Dde4utyo5Jd/",
    tag: "AI",
    stats: { views: 335000, likes: 6861, comments: 3124 },
  },
  {
    id: "DdmqbYyIMbW",
    title: "أفضل أدوات الذكاء الإصطناعي - الجزء 2",
    description: "مقارنة أفضل أدوات الذكاء الإصطناعي لي راح تسهل عليك حياتك",
    imageUrl: "/img/reels/DdZzfuWIT4d.png",
    href: "https://www.instagram.com/p/DdmqbYyIMbW/",
    tag: "AI",
    stats: { views: 343000, likes: 9607, comments: 1020 },
  },
  // {
  //   id: "DdZzfuWIT4d",
  //   title: "أفضل أدوات الذكاء الإصطناعي - الجزء 1",
  //   description: "مقارنة أفضل أدوات الذكاء الإصطناعي لي راح تسهل عليك حياتك",
  //   imageUrl: "/img/reels/DdZzfuWIT4d.png",
  //   href: "https://www.instagram.com/p/DdZzfuWIT4d/",
  //   tag: "AI",
  //   stats: { views: 106000, likes: 2808, comments: 411 },
  // },
  // {
  //   id: "DdkE4G5IkeH",
  //   title: "واش يعرف chatgpt عليك",
  //   description: "جرب هاذ الصورة مع البرومبت و بارطاجي معانا النتيجة تاعك",
  //   imageUrl: "/img/reels/HSeqknYXYAAqWxd.png",
  //   href: "https://www.instagram.com/reel/DdkE4G5IkeH/",
  //   tag: "AI",
  //   stats: { views: 92100, likes: 3047, comments: 149 },
  // },
];
