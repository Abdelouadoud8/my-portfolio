"use client";

import { useEffect, useRef } from "react";
import { MomyzLogo } from "../icons/logos/momyz";
import { HoskadevLogo } from "../icons/logos/hoskadev";
import SectionHeader from "../section-header";

const clientsLogos = [
  { Logo: MomyzLogo, name: "momyz" },
  { Logo: HoskadevLogo, name: "hoskadev" },
  { Logo: MomyzLogo, name: "momyz" },
  { Logo: HoskadevLogo, name: "hoskadev" },
  { Logo: MomyzLogo, name: "momyz" },
  { Logo: HoskadevLogo, name: "hoskadev" },
  { Logo: MomyzLogo, name: "momyz" },
  { Logo: HoskadevLogo, name: "hoskadev" },
  { Logo: MomyzLogo, name: "momyz" },
  { Logo: HoskadevLogo, name: "hoskadev" },
  { Logo: MomyzLogo, name: "momyz" },
];

export default function ClientsCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollSpeed = 0.5;

    const animate = () => {
      if (!container) return;

      container.scrollLeft += scrollSpeed;

      // Loop back to start
      if (
        container.scrollLeft >=
        container.scrollWidth - container.clientWidth
      ) {
        container.scrollLeft = 0;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <section className="w-full py-12 overflow-hidden text-center">
      <SectionHeader
        subtitle="Our Clients"
        title="Discover some of the client that have put trust on us"
      />
      <div
        className="flex gap-16 items-center overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide px-8"
        ref={containerRef}
      >
        {clientsLogos.map(({ Logo, name }, index) => (
          <div
            key={index}
            aria-label={name}
            className="mt-8 min-w-[10rem] flex-shrink-0 h-24 flex items-center justify-center"
          >
            <Logo
              className={`w-24 h-12 text-gray-4 hover:text-${name} transition duration-300 ease-in-out`}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
