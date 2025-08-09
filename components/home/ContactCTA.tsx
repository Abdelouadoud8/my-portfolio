"use client";

import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function ContactCTA() {
  const router = useRouter();

  return (
    <div className="w-full flex flex-row justify-between items-center px-12 py-16 rounded-2xl bg-[url('/img/contactctabg.png')] bg-cover bg-center bg-no-repeat">
      <h2 className="text-4xl font-medium text-white">
        Want to discuss a project?
      </h2>
      <Button
        onClick={() => {
          router.push("/contact");
        }}
      >
        Book a call
      </Button>
    </div>
  );
}
