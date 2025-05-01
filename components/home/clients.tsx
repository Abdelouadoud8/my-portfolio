"use client";

import { MomyzLogo } from "../icons/logos/momyz";
import { HoskadevLogo } from "../icons/logos/hoskadev";
import SectionHeader from "../section-header";
import ClientBox from "./client-box";
import { SpartifyLogo } from "../icons/logos/spartify";
import { SpinetLogo } from "../icons/logos/spinet";
import { WadiniLogo } from "../icons/logos/wadini";

const clientsLogos = [
  { Logo: MomyzLogo, name: "momyz" },
  { Logo: HoskadevLogo, name: "hoskadev" },
  { Logo: SpartifyLogo, name: "spartify" },
  { Logo: SpinetLogo, name: "spinet" },
  { Logo: WadiniLogo, name: "wadini" },
  { Logo: WadiniLogo, name: "wadini" },
  { Logo: SpinetLogo, name: "spinet" },
  { Logo: SpartifyLogo, name: "spartify" },
  { Logo: HoskadevLogo, name: "hoskadev" },
  { Logo: MomyzLogo, name: "momyz" },
];

export default function ClientsCarousel() {
  return (
    <section className="w-full py-12 overflow-hidden text-center">
      <SectionHeader
        subtitle="Our Clients"
        title="Discover some of the client that have put trust on us"
      />
      <div className="mt-12 md:mt-18 grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8 bg-white">
        {clientsLogos.map(({ Logo }, index) => {
          return (
            <ClientBox key={index}>
              <Logo />
            </ClientBox>
          );
        })}
      </div>
    </section>
  );
}
