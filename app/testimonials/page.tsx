"use client";

import SectionHeader from "@/components/section-header";
import TestimonialCaroussel from "@/components/testimonials/testimonial-caroussel";

export default function Testimonials() {
  return (
    <div className="lg:px-16 mb-32 md:mb-0 flex flex-col items-center text-center md:text-left min-h-screen">
      <SectionHeader
        title="Trusted by brands all over the world"
        subtitle="Testimonials"
      />
      <TestimonialCaroussel />
    </div>
  );
}
