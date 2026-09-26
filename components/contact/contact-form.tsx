"use client";
import React, { useEffect, useRef, useState } from "react";
import { EVENTS, trackEvent } from "@/lib/analytics";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { IconEmail } from "../icons/icon-email";
import { Textarea } from "../ui/textarea";
import { IconPhone } from "../icons/icon-phone";

const initialFormData = {
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

type ContactFormProps = {
  title?: string;
  className?: string;
};

export default function ContactForm({ title, className }: ContactFormProps) {
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const hasStarted = useRef(false);
  // Anti-spam: when the form was shown, and a hidden field only bots fill in
  const startedAt = useRef(0);
  const [honeypot, setHoneypot] = useState("");

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const handleChange = (field: string, value: string) => {
    if (!hasStarted.current) {
      hasStarted.current = true;
      trackEvent(EVENTS.contactFormStart);
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          website: honeypot,
          startedAt: startedAt.current,
        }),
      });

      trackEvent(EVENTS.contactFormSubmit, {
        status: res.ok ? "success" : "error",
      });

      if (res.ok) {
        alert(
          "Your message has been successfully sent. I will get back to you soon!"
        );
        setFormData(initialFormData);
        startedAt.current = Date.now();
      } else {
        const { error } = await res.json().catch(() => ({ error: "" }));
        alert(error || "Your message could not be sent. Please try again later");
      }
    } catch (e) {
      trackEvent(EVENTS.contactFormSubmit, { status: "network-error" });
      alert("Your message could not be sent. Please try again later");
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-col gap-8 bg-neutral-5 p-6 rounded-lg border-1 border-neutral-20 ${className}`}
    >
      {title && (
        <h2 className="text-neutral-100 font-semibold text-xl text-left">
          {title}
        </h2>
      )}
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        {/* Honeypot: hidden from people and screen readers, bots fill it in */}
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />
        {/* General information */}
        <div className="grid grid-col-1 sm:grid-cols-2 gap-6">
          <Input
            required
            placeholder="ex. John"
            type="text"
            value={formData.firstname}
            onChange={(e) => handleChange("firstname", e.target.value)}
            label="Firstname"
            name="Firstname"
            maxLength={100}
          />
          <Input
            required
            placeholder="ex. Doe"
            type="text"
            value={formData.lastname}
            onChange={(e) => handleChange("lastname", e.target.value)}
            label="Lastname"
            name="Lastname"
            maxLength={100}
          />
          <Input
            required
            placeholder="example@gmail.com"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            leftIcon={<IconEmail className="h-5 w-5 text-neutral-70" />}
            label="Email"
            name="email"
            maxLength={254}
          />
          <Input
            required
            placeholder="+33"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            leftIcon={<IconPhone className="h-5 w-5 text-neutral-70" />}
            type="tel"
            label="Phone"
            name="phone"
            maxLength={30}
          />
        </div>

        <Input
          required
          placeholder="Enter your subject"
          value={formData.subject}
          onChange={(e) => handleChange("subject", e.target.value)}
          type="text"
          label="Subject"
          name="subject"
          maxLength={200}
        />

        <Textarea
          placeholder="Describe your needs"
          label="Message"
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          name="message"
          maxLength={5000}
        />

        {/* CTA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="order-1 sm:order-2"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Sending message..." : "Submit"}
          </Button>
          <Button
            variant="outline"
            type="button"
            className="order-2 sm:order-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
