import React from "react";
import Image from "next/image";

export default function Heading() {
  return (
    <div className="w-full flex flex-col mt-4 sm:mt-2 items-center sm:px-24 md:px-40 lg:px-56">
      <Image
        src={"/mypicture2.jpeg"}
        width={72}
        height={72}
        alt={"Portfolio cover"}
        className="rounded-full mb-4 sm:mb-8"
      />
      <h1 className="text-black font-medium text-base sm:text-2xl mb-6">
        Hi, I’m Abdelouadoud 🤙
      </h1>
      <h3 className="text-neutral-100 text-xl text-center">
        I’m a Software Engineer at Atos and a freelance UI/UX designer with over
        4 years experience in building brands and digital experiences.
      </h3>
    </div>
  );
}
