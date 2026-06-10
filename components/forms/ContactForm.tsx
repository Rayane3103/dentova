"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { FormField, formInputClassName } from "@/components/forms/FormField";
import { Button } from "@/components/ui/Button";
import { contactSchema } from "@/lib/validators/contact";

type ContactValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (values: ContactValues) => {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    if (!response.ok) {
      toast.error("Message non envoye. Reessayez dans un instant.");
      return;
    }

    toast.success("Votre message a bien ete envoye.");
    reset();
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          error={errors.fullName?.message}
          htmlFor="contact-fullName"
          label="Nom complet"
          required
        >
          <input
            className={formInputClassName()}
            id="contact-fullName"
            placeholder="Dr. Sarah Benali"
            {...register("fullName")}
          />
        </FormField>
        <FormField
          error={errors.email?.message}
          htmlFor="contact-email"
          label="Email"
          required
        >
          <input
            className={formInputClassName()}
            id="contact-email"
            placeholder="sarah.benali@gmail.com"
            type="email"
            {...register("email")}
          />
        </FormField>
      </div>

      <FormField
        error={errors.phone?.message}
        hint="Optionnel"
        htmlFor="contact-phone"
        label="Telephone"
      >
        <input
          className={formInputClassName()}
          id="contact-phone"
          placeholder="0550 12 34 56"
          type="tel"
          {...register("phone")}
        />
      </FormField>

      <FormField
        error={errors.message?.message}
        htmlFor="contact-message"
        label="Message"
        required
      >
        <textarea
          className={formInputClassName("min-h-32 resize-none")}
          id="contact-message"
          placeholder="Votre demande..."
          rows={5}
          {...register("message")}
        />
      </FormField>

      <Button
        className="w-full rounded-lg"
        disabled={isSubmitting}
        size="md"
        type="submit"
        variant="primary"
      >
        {isSubmitting ? (
          <>
            <Loader className="h-4 w-4 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          "Envoyer le message"
        )}
      </Button>

      <p className="text-center text-xs text-dentova-navy-500">
        Vos informations restent confidentielles.
      </p>
    </form>
  );
}
