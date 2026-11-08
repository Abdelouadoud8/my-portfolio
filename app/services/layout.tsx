import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import Footer from "@/components/shared/footer";
import { sitePreviewImage } from "@/lib/link-preview";

// Darja pages: Plus Jakarta Sans has no Arabic glyphs
const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Services",
    template: "%s | Abdelouadoud",
  },
  // Shared from Instagram: small static preview image (see lib/link-preview.ts)
  openGraph: {
    siteName: "Abdelouadoud's Portfolio",
    images: [sitePreviewImage],
    type: "website",
  },
};

// Service pages (1:1, business): no portfolio header (reached from /links), shared footer, violet accent like /links
export default function ServicesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${arabic.variable} theme-links flex min-h-dvh flex-col bg-white`}>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
