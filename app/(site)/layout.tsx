import Header from "@/components/header";
import Footer from "@/components/footer";

// Portfolio chrome (header, container, footer). Pages outside this group, like /links, render bare.
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="container mx-auto px-8 sm:px-4 lg:px-16 pt-6 pb-24">
        {children}
      </main>
      <Footer />
    </>
  );
}
