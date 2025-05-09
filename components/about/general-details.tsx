import Image from "next/image";

function GeneralDetails() {
  return (
    <div className="flex flex-col md:flex-row justify-between my-8 gap-[2rem] lg:gap-[8rem]">
      <div className="relative w-full md:w-[1500px] h-[520px] mb-4 sm:mb-8">
        <Image
          src="/mypicture.jpeg"
          alt="Portfolio cover"
          fill
          className="object-cover rounded-md"
        />
      </div>
      <div className="mt-6 flex flex-col gap-[1.5rem]">
        <p className="text-3xl sm:text-4xl">👋</p>
        <span className="text-3xl sm:text-4xl font-bold text-neutral-10">
          Mahdaoui Abdelouadoud
        </span>
        <p className="text-lg leading-[2rem] text-neutral-100 font-medium ">
          I am Ouadoud! A passionate Software Engineer who is always eager to
          learn about different development languages, responsive frameworks,
          databases, and best code practices. I’m also a UI/UX designer focused
          on building brands and digital experiences.
        </p>
        <p className="text-sm leading-[2rem] font-light text-neutral-50">
          As a specialist in bridging brand identity through the fusion of Web
          Development and UX/UI, I craft innovative and impactful design
          solutions for the modern era. <br /> Beyond work, I find joy in
          playing volleyball and exploring different places through travel. In
          my leisure time, I indulge in watching anime and count myself as a big
          fan of the TV series Friends.
        </p>
      </div>
    </div>
  );
}

export default GeneralDetails;
