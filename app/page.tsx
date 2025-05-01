"use client";

import ClientsCarousel from "@/components/home/clients-caroussel";
import Heading from "@/components/home/heading";
import Projects from "@/components/home/projects";
import TestimonialCaroussel from "@/components/testimonials/testimonial-caroussel";

export default function Home() {
  return (
    <div className="flex flex-col gap-32">
      <Heading />
      <Projects />
      <div className="mb-32 flex flex-col items-center text-center md:text-left gap-5">
        <h1 className="text-3xl font-semibold">My clients</h1>
        <ClientsCarousel />
      </div>
      <div className="mb-32 flex flex-col items-center text-center md:text-left gap-5">
        <h1 className="text-3xl font-semibold">Testimonials</h1>
        <TestimonialCaroussel />
      </div>
    </div>
  );
}
