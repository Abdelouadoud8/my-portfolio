import React, { useState } from "react";
import { testimonials } from "@/data/testimonials";
import { IconLeftArrow } from "@/components/icons/icon-arrow-left";
import { IconRightArrow } from "@/components/icons/icon-arrow-right";
import CarousselImage from "./caroussel-image";

export default function TestimonialCaroussel() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const previousTestimonial = () => {
    setCurrentIndex((prev) => (prev === 0 ? 0 : prev - 1));
  };

  const testimonial = testimonials[currentIndex];

  return (
    <div className="flex flex-col md:flex-row justify-between my-8 gap-[2rem] md:gap-[4rem] lg:gap-[8rem]">
      <CarousselImage imageUrl={testimonial.imageUrl} />
      <div className="mt-3 lg:mt-6 w-full md:w-5/8 flex flex-col gap-12">
        <div className="flex flex-col gap-[1.5rem] md:min-h-64">
          <p className="text-lg md:text-xl leading-[2rem] text-gray-1 font-medium ">
            {testimonial.title}
          </p>
          <p className="text-sm md:text-base leading-[1.75rem] font-light text-gray-3">
            {testimonial.description}
          </p>
          <div className="flex flex-col lg:flex-row gap-4 text-base">
            <span className="font-medium">{testimonial.fullname}</span>
            <p className="font-semibold text-gray-5">
              {" "}
              {testimonial.occupation}
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-8 justify-center md:justify-end">
          <button
            onClick={previousTestimonial}
            disabled={currentIndex === 0}
            aria-label="Previous testimonial"
            className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform duration-150"
          >
            <IconLeftArrow
              className={`text-${currentIndex === 0 ? "gray-4" : "primary"}`}
            />
          </button>
          <button
            onClick={nextTestimonial}
            disabled={currentIndex === testimonials.length - 1}
            aria-label="Next testimonial"
            className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform duration-150"
          >
            <IconRightArrow
              className={`text-${
                currentIndex === testimonials.length - 1 ? "gray-4" : "primary"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
