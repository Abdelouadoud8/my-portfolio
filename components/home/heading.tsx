import React from "react";
import Image from "next/image";

export default function Heading() {
  return (
    <div className="w-full flex flex-col mt-4 sm:mt-2 font-sans items-center sm:px-86">
      <Image
        src={"/mypicture.jpeg"}
        width={64}
        height={64}
        alt={"Portfolio cover"}
        className="rounded-full mb-4 sm:mb-8"
      />
      <h1 className="text-black font-medium text-base sm:text-xl mb-6">
        Hi, I’m Abdelouadoud 🤙
      </h1>
      <h3 className="text-neutral-100 text-xl text-center">
        I’m a fresh graduated Software engineer and UI/UX designer focused on
        building brands and digital experiences
      </h3>
    </div>
  );
}
