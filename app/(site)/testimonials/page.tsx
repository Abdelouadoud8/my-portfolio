"use client";

import SectionHeader from "@/components/section-header";
import TestimonialCaroussel from "@/components/testimonials/testimonial-caroussel";

export default function Testimonials() {
  return (
    <div className="lg:px-16 flex flex-col items-center text-center md:text-left">
      <SectionHeader
        title="Trusted by brands all over the world"
        subtitle="Testimonials"
      />
      <TestimonialCaroussel />
    </div>
  );
}
