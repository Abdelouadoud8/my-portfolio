import type { Metadata } from "next";
import "./index.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import UmamiAnalytics from "@/components/shared/analytics/umami-analytics";

const poppins = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // 700 -> Bold,
  variable: "--font-poppins", // optional if you want to use a CSS variable
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Abdelouadoud's Portfolio",
    template: "%s | Abdelouadoud's Portfolio",
  },
  description:
    "Hey it is Abdelouadoud, I’m a Software Engineer & freelance UI/UX designer with over 4 years experience in building brands and digital experiences.",
  keywords: [
    "Next.js",
    "SEO",
    "Web Development",
    "Software Engineer",
    "UI/UX Design",
    "Product Designer",
  ],
  authors: [
    { name: "Mahdaoui Abdelouadoud", url: "abdelouadoud-portfolio.vercel.app" },
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.className}>
      <body className="background-white">
        {children}
        <Analytics />
        <UmamiAnalytics />
      </body>
    </html>
  );
}
