"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, LogIn } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { adminLabelClassName } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { adminLoginSchema } from "@/lib/validators/admin";

type AdminLoginValues = z.infer<typeof adminLoginSchema>;

export function AdminLoginForm() {
  const searchParams = useSearchParams();
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register
  } = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema)
  });

  const onSubmit = async (values: AdminLoginValues) => {
    const response = await fetch("/api/admin/login", {
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
      toast.error(data?.error || validationError || "Identifiants admin invalides.");
      return;
    }

    toast.success("Connexion réussie.");
    const nextPath = searchParams.get("next");
    const destination =
      nextPath && nextPath.startsWith("/admin") ? nextPath : "/admin";
    window.location.assign(destination);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <label className="block">
        <span className={adminLabelClassName}>Email</span>
        <Input
          placeholder="admin@dentova.com"
          size="sm"
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
        <span className={adminLabelClassName}>Mot de passe</span>
        <Input
          placeholder="Votre mot de passe"
          size="sm"
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
        size="sm"
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
