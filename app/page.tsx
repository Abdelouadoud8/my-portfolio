"use client";

import ClientsCarousel from "@/components/home/clients";
import ContactCTA from "@/components/home/ContactCTA";
import Heading from "@/components/home/heading";
import Projects from "@/components/home/projects";
import SectionHeader from "@/components/section-header";
import TestimonialCaroussel from "@/components/testimonials/testimonial-caroussel";

export default function Home() {
  return (
    <div className="flex flex-col gap-32">
      <Heading />
      <Projects />
      <ClientsCarousel />
      <div className="flex flex-col items-center text-center md:text-left gap-5">
        <SectionHeader
          subtitle="Testimonials"
          title="Trusted by brands all over the world"
        />
        <TestimonialCaroussel />
      </div>
      <ContactCTA />
    </div>
  );
}
