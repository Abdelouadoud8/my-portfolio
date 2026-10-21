"use client";

import { MomyzLogo } from "@/components/shared/icons/logos/momyz";
import { HoskadevLogo } from "@/components/shared/icons/logos/hoskadev";
import SectionHeader from "@/components/portfolio/section-header";
import ClientBox from "@/components/portfolio/home/client-box";
import { SpartifyLogo } from "@/components/shared/icons/logos/spartify";
import { SpinetLogo } from "@/components/shared/icons/logos/spinet";
import { WadiniLogo } from "@/components/shared/icons/logos/wadini";
import { FcConnectLogo } from "@/components/shared/icons/logos/fcconnect";
import { TaalimLogo } from "@/components/shared/icons/logos/taalim";
import { LastingDynamicsLogo } from "@/components/shared/icons/logos/lastingdynamics";

const clientsLogos = [
  { Logo: MomyzLogo, name: "Momyz" },
  { Logo: LastingDynamicsLogo, name: "Lasting Dynamics" },
  { Logo: SpartifyLogo, name: "Spartify" },
  { Logo: SpinetLogo, name: "Spinet" },
  { Logo: TaalimLogo, name: "Taalim" },
  { Logo: WadiniLogo, name: "Wadini" },
  { Logo: FcConnectLogo, name: "FC Connect" },
  { Logo: HoskadevLogo, name: "HoskaDev" },
];

export default function ClientsCarousel() {
  return (
    <section className="text-amber-900 w-full py-12 overflow-hidden text-center">
      <SectionHeader
        subtitle="Previous Clients"
        title="Discover some of the client that have put trust on us"
      />
      <div className=" mt-12 md:mt-18 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-8 bg-white">
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
