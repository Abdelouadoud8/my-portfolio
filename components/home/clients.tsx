"use client";

import { MomyzLogo } from "../icons/logos/momyz";
import { HoskadevLogo } from "../icons/logos/hoskadev";
import SectionHeader from "../section-header";
import ClientBox from "./client-box";
import { SpartifyLogo } from "../icons/logos/spartify";
import { SpinetLogo } from "../icons/logos/spinet";
import { WadiniLogo } from "../icons/logos/wadini";
import { FcConnectLogo } from "../icons/logos/fcconnect";
import { TaalimLogo } from "../icons/logos/taalim";
import { LastingDynamicsLogo } from "../icons/logos/lastingdynamics";

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
