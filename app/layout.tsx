import type { Metadata } from "next";
import "./index.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

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
  openGraph: {
    title: "Abdelouadoud's Portfolio",
    description:
      "Hey it is Abdelouadoud, I’m a Software Engineer & freelance UI/UX designer with over 4 years experience in building brands and digital experiences.",
    url: "abdelouadoud-portfolio.vercel.app",
    siteName: "Abdelouadoud's Portfolio",
    images: [
      {
        url: "https://abdelouadoud-portfolio.vercel.app/_next/image?url=%2Fmypicture2.jpeg&w=256&q=75", // must be an absolute URL!
        width: 1200,
        height: 630,
        alt: "Preview of My Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
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
        <Header />
        <main className="container mx-auto px-8 sm:px-4 lg:px-16 pt-6 pb-24">
          {children}
          <Analytics />
        </main>
        <Footer />
      </body>
    </html>
  );
}
