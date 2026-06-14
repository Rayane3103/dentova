"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, LogIn } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { marketerLoginSchema } from "@/lib/validators/marketer";

type LoginValues = z.infer<typeof marketerLoginSchema>;

export function UnifiedLoginForm() {
  const searchParams = useSearchParams();

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register
  } = useForm<LoginValues>({
    resolver: zodResolver(marketerLoginSchema)
  });

  const onSubmit = async (values: LoginValues) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(values)
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as
        | { error?: string; errors?: { fieldErrors?: Record<string, string[]> } }
        | null;
      const validationError = data?.errors?.fieldErrors
        ? Object.values(data.errors.fieldErrors).flat()[0]
        : undefined;
      toast.error(data?.error || validationError || "Identifiants invalides.");
      return;
    }

    const data = (await response.json()) as {
      ok: boolean;
      role: "admin" | "marketer";
      redirectTo: string;
    };

    toast.success(
      data.role === "admin"
        ? "Connexion admin réussie."
        : "Connexion marketing réussie."
    );

    const nextPath = searchParams.get("next");
    let destination = data.redirectTo;

    // If a "next" param was provided and it matches the user's role, use it
    if (nextPath) {
      if (
        (data.role === "admin" && nextPath.startsWith("/admin")) ||
        (data.role === "marketer" && nextPath.startsWith("/marketer"))
      ) {
        destination = nextPath;
      }
    }

    window.location.assign(destination);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-slate-700">
          Email
        </span>
        <Input
          placeholder="admin@dentova.com"
          size="md"
          type="email"
          {...register("email")}
        />
        {errors.email && (
          <span className="mt-1 block text-xs font-semibold text-red-600">
            {errors.email.message}
          </span>
        )}
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-slate-700">
          Mot de passe
        </span>
        <Input
          placeholder="Votre mot de passe"
          size="md"
          type="password"
          {...register("password")}
        />
        {errors.password && (
          <span className="mt-1 block text-xs font-semibold text-red-600">
            {errors.password.message}
          </span>
        )}
      </label>

      <Button
        className="w-full"
        disabled={isSubmitting}
        size="md"
        type="submit"
        variant="primary"
      >
        {isSubmitting ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <LogIn className="h-4 w-4" />
        )}
        Se connecter
      </Button>
    </form>
  );
}
