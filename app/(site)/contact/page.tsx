import ContactForm from "@/components/contact/contact-form";
import { IconEmail } from "@/components/icons/icon-email";
import { IconWhatsapp } from "@/components/icons/icon-whatsapp";
import SectionHeader from "@/components/section-header";
import React from "react";

export default function Contact() {
  const contacts = [
    { icon: IconEmail, content: "abdelouadoud.mahdaoui@gmail.com" },
    { icon: IconWhatsapp, content: "+33773471197" },
  ];

  return (
    <div className="md:mb-0 flex flex-col items-center text-center md:text-left gap-20">
      <SectionHeader
        title="Get in touch easily the way that works best for you"
        subtitle="Reach out"
      />
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="flex flex-col gap-8 pt-0 sm:pt-32">
          <div>
            <h1 className="font-semibold text-4xl mb-2 hidden md:block">
              Reach Me
            </h1>
            <p className="text-neutral-80 text-lg">
              Have a question, a project in mind, or need an estimate? Feel free
              to reach out via email, phone, or the contact form — I&lsquo;m
              happy to help!
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {contacts.map((contact, index) => {
              return (
                <div
                  key={index}
                  className="flex flex-row gap-2 items-center text-base lg:text-lg text-neutral-100"
                >
                  <contact.icon width={32} height={32} />
                  <p>{contact.content}</p>
                </div>
              );
            })}
          </div>
        </div>
        <ContactForm
          title="Looking to get something done? You’re in the right place."
          className="w-full"
        />
      </div>
    </div>
  );
}
