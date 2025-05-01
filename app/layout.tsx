import type { Metadata } from "next";
import "./index.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // 700 -> Bold,
  variable: "--font-poppins", // optional if you want to use a CSS variable
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ouadoud's Portfolio",
  description:
    "Hey it Abdelouadoud, A web developer and UI/UX design. Welcome to my portfolio, I hope you enjoy it.",
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
        <main className="container mx-auto px-8 sm:px-4 lg:px-16 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
