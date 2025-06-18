"use client";
import React, { useState } from "react";
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

  const handleChange = (field: string, value: string) => {
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
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Message envoyé avec succès !");
        setFormData(initialFormData);
      } else {
        alert("Une erreur est survenue.");
      }
    } catch (e) {
      alert("Une erreur est survenue.");
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
          />
          <Input
            required
            placeholder="ex. Doe"
            type="text"
            value={formData.lastname}
            onChange={(e) => handleChange("lastname", e.target.value)}
            label="Lastname"
            name="Lastname"
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
          />
          <Input
            required
            placeholder="+33"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            leftIcon={<IconPhone className="h-5 w-5 text-neutral-70" />}
            type="number"
            label="Phone"
            name="phone"
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
        />

        <Textarea
          placeholder="Describe your needs"
          label="Message"
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          name="message"
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
