import type { Metadata } from "next";
import ClientsCarousel from "@/components/portfolio/home/clients";
import ContactCTA from "@/components/portfolio/home/ContactCTA";
import Heading from "@/components/portfolio/home/heading";
import Projects from "@/components/portfolio/home/projects";
import SectionHeader from "@/components/portfolio/section-header";
import TestimonialCaroussel from "@/components/portfolio/testimonials/testimonial-caroussel";

// Link preview (OpenGraph) only on the home page: other pages share without one
export const metadata: Metadata = {
  openGraph: {
    title: "Abdelouadoud's Portfolio",
    description:
      "Hey it is Abdelouadoud, I’m a Software Engineer & freelance UI/UX designer with over 4 years experience in building brands and digital experiences.",
    url: "abdelouadoud-portfolio.vercel.app",
    siteName: "Abdelouadoud's Portfolio",
    images: [
      {
        url: "https://abdelouadoud-portfolio.vercel.app/_next/image?url=%2Fshared%2Fhomepicture.jpg&w=256&q=75",
        width: 1200,
        height: 630,
        alt: "Preview of My Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function Home() {
  return (
    <div className="flex flex-col gap-32">
      <Heading />
      <Projects />
      <ClientsCarousel />
      <div className="flex flex-col items-center text-center md:text-left gap-5">
        <SectionHeader
          subtitle="Testimonials"
          title="Trusted by leaders all over the world"
        />
        <TestimonialCaroussel />
      </div>
      <ContactCTA />
    </div>
  );
}
