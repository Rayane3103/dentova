"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { adminLoginSchema } from "@/lib/validators/admin";

type AdminLoginValues = z.infer<typeof adminLoginSchema>;

export function AdminLoginForm() {
  const router = useRouter();
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
      body: JSON.stringify(values)
    });

    if (!response.ok) {
      toast.error("Identifiants admin invalides.");
      return;
    }

    toast.success("Connexion reussie.");
    router.push("/admin");
    router.refresh();
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <label className="block">
        <span className="mb-2 block font-bold text-dentova-navy">Email</span>
        <Input placeholder="admin@dentova.com" type="email" {...register("email")} />
        {errors.email ? (
          <span className="mt-1 block text-sm font-semibold text-dentova-magenta">
            {errors.email.message}
          </span>
        ) : null}
      </label>
      <label className="block">
        <span className="mb-2 block font-bold text-dentova-navy">
          Mot de passe
        </span>
        <Input placeholder="Votre mot de passe" type="password" {...register("password")} />
        {errors.password ? (
          <span className="mt-1 block text-sm font-semibold text-dentova-magenta">
            {errors.password.message}
          </span>
        ) : null}
      </label>
      <Button className="w-full" disabled={isSubmitting} type="submit">
        <LogIn className="h-5 w-5" />
        Se connecter
      </Button>
    </form>
  );
}
