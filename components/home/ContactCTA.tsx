"use client";

import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function ContactCTA() {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col sm:flex-row gap-8 justify-between items-center px-8 py-12 sm:px-12 sm:py-16 rounded-2xl bg-[url('/img/contactctabg.png')] bg-cover bg-center bg-no-repeat">
      <h2 className="text-4xl font-medium text-white text-center sm:text-left">
        Want to discuss your next project?
      </h2>
      <Button
        onClick={() => {
          router.push("/contact");
        }}
        className="w-full sm:w-fit"
      >
        Book a call
      </Button>
    </div>
  );
}
