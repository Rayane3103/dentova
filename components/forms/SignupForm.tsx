"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { FormField, formInputClassName } from "@/components/forms/FormField";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Textarea } from "@/components/ui/Textarea";
import { signupSchema } from "@/lib/validators/signup";

type SignupValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset
  } = useForm<SignupValues>({
    defaultValues: { newsletterOptIn: true },
    resolver: zodResolver(signupSchema)
  });

  const onSubmit = async (values: SignupValues) => {
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    if (!response.ok) {
      toast.error("Inscription impossible pour le moment.");
      return;
    }

    toast.success("Inscription envoyee. Notre equipe vous contactera bientot.");
    reset({ newsletterOptIn: true });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField error={errors.fullName?.message} label="Nom complet *">
          <input className={formInputClassName()} {...register("fullName")} />
        </FormField>
        <FormField error={errors.email?.message} label="Email *">
          <input className={formInputClassName()} type="email" {...register("email")} />
        </FormField>
        <FormField error={errors.phone?.message} label="Telephone *">
          <input className={formInputClassName()} {...register("phone")} />
        </FormField>
        <FormField error={errors.profession?.message} label="Profession *">
          <input className={formInputClassName()} {...register("profession")} />
        </FormField>
        <FormField error={errors.wilaya?.message} label="Wilaya *">
          <input className={formInputClassName()} {...register("wilaya")} />
        </FormField>
        <FormField error={errors.courseInterest?.message} label="Formation souhaitee">
          <input className={formInputClassName()} {...register("courseInterest")} />
        </FormField>
      </div>
      <FormField error={errors.message?.message} label="Message">
        <Textarea className="min-h-32" placeholder="Parlez-nous de vos objectifs..." {...register("message")} />
      </FormField>
      <label className="flex items-center gap-2 text-sm font-semibold text-dentova-navy-700">
        <Checkbox defaultChecked {...register("newsletterOptIn")} />
        Je souhaite aussi recevoir la newsletter Dentova
      </label>
      <Button className="w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? <Loader className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
        Envoyer mon inscription
      </Button>
    </form>
  );
}
