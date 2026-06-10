"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { FormField, formInputClassName } from "@/components/forms/FormField";
import { StarRating } from "@/components/forms/StarRating";
import { Button } from "@/components/ui/Button";
import { feedbackSchema } from "@/lib/validators/feedback";

type FeedbackValues = z.infer<typeof feedbackSchema>;

export function FeedbackForm() {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setValue,
    watch
  } = useForm<FeedbackValues>({
    defaultValues: { rating: 5 },
    resolver: zodResolver(feedbackSchema)
  });

  const rating = watch("rating") ?? 5;

  const onSubmit = async (values: FeedbackValues) => {
    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    if (!response.ok) {
      toast.error("Avis non envoye. Reessayez dans un instant.");
      return;
    }

    toast.success("Merci pour votre retour.");
    reset({ rating: 5 });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          error={errors.fullName?.message}
          htmlFor="feedback-fullName"
          label="Nom complet"
          required
        >
          <input
            className={formInputClassName()}
            id="feedback-fullName"
            placeholder="Dr. Meriem Mansouri"
            {...register("fullName")}
          />
        </FormField>
        <FormField
          error={errors.email?.message}
          htmlFor="feedback-email"
          label="Email"
          required
        >
          <input
            className={formInputClassName()}
            id="feedback-email"
            placeholder="meriem.mansouri@gmail.com"
            type="email"
            {...register("email")}
          />
        </FormField>
      </div>

      <FormField htmlFor="feedback-courseName" label="Formation suivie">
        <input
          className={formInputClassName()}
          id="feedback-courseName"
          placeholder="Ex. Implantologie avancee — Alger"
          {...register("courseName")}
        />
      </FormField>

      <FormField label="Note">
        <StarRating
          onChange={(value) =>
            setValue("rating", value, { shouldValidate: true })
          }
          value={rating}
        />
        <input type="hidden" {...register("rating")} />
      </FormField>

      <FormField
        error={errors.message?.message}
        htmlFor="feedback-message"
        label="Votre avis"
        required
      >
        <textarea
          className={formInputClassName("min-h-28 resize-none")}
          id="feedback-message"
          placeholder="Decrivez votre experience..."
          rows={4}
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
          "Envoyer mon avis"
        )}
      </Button>
    </form>
  );
}
