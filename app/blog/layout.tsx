import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import Footer from "@/components/footer";
import BlogHeader from "@/components/blog/blog-header";

// Arabic articles: Plus Jakarta Sans has no Arabic glyphs
const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Blog",
    template: "%s | Abdelouadoud's Blog",
  },
  description:
    "Detailed steps for the AI tips and tutorials shared in Abdelouadoud's Instagram reels.",
};

// Blog chrome: its own light header (not the portfolio menu) + the shared footer
export default function BlogLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${arabic.variable} flex min-h-dvh flex-col bg-white`}>
      <BlogHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
