"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { newsletterSchema } from "@/lib/validators/newsletter";
import { cn } from "@/lib/utils";

type NewsletterValues = z.infer<typeof newsletterSchema>;

export function NewsletterForm({
  compact = false,
  dark = false,
  footer = false,
  placeholder = "votre.email@gmail.com",
  submitLabel = "S'abonner"
}: {
  compact?: boolean;
  dark?: boolean;
  footer?: boolean;
  placeholder?: string;
  submitLabel?: string;
}) {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset
  } = useForm<NewsletterValues>({
    resolver: zodResolver(newsletterSchema)
  });

  const onSubmit = async (values: NewsletterValues) => {
    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    if (!response.ok) {
      toast.error("Inscription impossible pour le moment.");
      return;
    }

    toast.success("Merci, vous etes inscrit a la newsletter.");
    reset();
  };

  if (dark) {
    if (footer) {
      return (
        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <input
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-white outline-none transition-all placeholder:text-dentova-navy-500 focus:border-dentova-teal-400"
            placeholder={placeholder}
            required
            type="email"
            {...register("email")}
          />
          <button
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-dentova-magenta px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-dentova-violet disabled:bg-dentova-navy-800"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {submitLabel}
          </button>
          {errors.email ? (
            <p className="text-xs font-semibold text-rose-400">
              {errors.email.message}
            </p>
          ) : null}
        </form>
      );
    }

    return (
      <form className="relative w-full" onSubmit={handleSubmit(onSubmit)}>
        <input
          className="w-full rounded-xl border border-white/15 bg-white/5 py-3 pl-4 pr-12 text-xs font-medium text-white outline-none transition-all placeholder:text-dentova-navy-500 focus:border-dentova-teal-400"
          placeholder={placeholder}
          required
          type="email"
          {...register("email")}
        />
        <button
          aria-label={submitLabel}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-dentova-magenta p-2 text-white transition-colors hover:bg-dentova-violet disabled:bg-dentova-navy-800"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? (
            <Loader className="h-3 w-3 animate-spin" />
          ) : (
            <Send className="h-3 w-3" />
          )}
        </button>
        {errors.email ? (
          <p className="mt-1 text-xs font-semibold text-rose-400">
            {errors.email.message}
          </p>
        ) : null}
      </form>
    );
  }

  return (
    <form
      className={cn(
        compact ? "mt-5 space-y-2" : "mt-6 flex flex-col gap-3 sm:flex-row"
      )}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex-1">
        <Input placeholder="Votre email" type="email" {...register("email")} />
        {errors.email ? (
          <p className="mt-1 text-sm font-semibold text-dentova-magenta">
            {errors.email.message}
          </p>
        ) : null}
      </div>
      <Button disabled={isSubmitting} size="md" type="submit" variant="secondary">
        {isSubmitting ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        {compact ? "S'inscrire" : "Recevoir les actualites"}
      </Button>
    </form>
  );
}
