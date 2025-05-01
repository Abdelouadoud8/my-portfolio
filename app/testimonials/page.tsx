"use client";

import TestimonialCaroussel from "@/components/testimonials/testimonial-caroussel";

export default function Testimonials() {
  return (
    <div className="lg:px-16 mb-32 md:mb-0 flex flex-col items-center text-center md:text-left">
      <h1 className="text-3xl font-semibold">Testimonials</h1>
      <TestimonialCaroussel />
    </div>
  );
}
