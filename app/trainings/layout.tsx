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
    default: "Trainings",
    template: "%s | Abdelouadoud's Trainings",
  },
  // Shared from Instagram: small static preview image (see lib/link-preview.ts)
  openGraph: {
    siteName: "Abdelouadoud's Portfolio",
    images: [sitePreviewImage],
    type: "website",
  },
};

// Training pages: no portfolio header (reached from /links), shared footer
export default function TrainingsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${arabic.variable} flex min-h-dvh flex-col bg-white`}>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
