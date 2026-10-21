"use client";

import ClientsCarousel from "@/components/portfolio/home/clients";
import ContactCTA from "@/components/portfolio/home/ContactCTA";
import Heading from "@/components/portfolio/home/heading";
import Projects from "@/components/portfolio/home/projects";
import SectionHeader from "@/components/portfolio/section-header";
import TestimonialCaroussel from "@/components/portfolio/testimonials/testimonial-caroussel";

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
