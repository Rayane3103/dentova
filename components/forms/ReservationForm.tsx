"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { formatPrice } from "@/lib/format";
import { reservationSchema } from "@/lib/validators/reservation";
import type { Course } from "@/types";

type ReservationValues = z.infer<typeof reservationSchema>;

export function ReservationForm({ course }: { course: Course }) {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset
  } = useForm<ReservationValues>({
    defaultValues: { courseId: course.id },
    resolver: zodResolver(reservationSchema)
  });

  const onSubmit = async (values: ReservationValues) => {
    const response = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    if (!response.ok) {
      toast.error("Reservation non envoyee. Reessayez dans un instant.");
      return;
    }

    toast.success("Votre demande de reservation est envoyee.");
    reset({ courseId: course.id });
  };

  return (
    <form
      className="rounded-lg border border-white/10 bg-dentova-graphite p-6 text-white shadow-luxe"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-3xl font-extrabold leading-none">Reservez votre place</h2>
      <p className="mt-3 text-base font-semibold text-white/70">
        Places limitees. Inscrivez-vous maintenant pour eviter toute deception.
      </p>
      <div className="mt-5 rounded-lg border border-white/10 bg-white/10 p-4">
        <div className="flex items-center justify-between text-lg font-bold">
          <span>Prix du cours</span>
          <span className="text-dentova-teal">{formatPrice(course.price)}</span>
        </div>
      </div>
      <input type="hidden" {...register("courseId")} />
      <div className="mt-5 space-y-3">
        <FieldError error={errors.fullName?.message}>
          <Input placeholder="Nom complet" {...register("fullName")} />
        </FieldError>
        <FieldError error={errors.email?.message}>
          <Input placeholder="Email" type="email" {...register("email")} />
        </FieldError>
        <FieldError error={errors.phone?.message}>
          <Input placeholder="Telephone" {...register("phone")} />
        </FieldError>
        <FieldError error={errors.wilaya?.message}>
          <Input placeholder="Wilaya" {...register("wilaya")} />
        </FieldError>
        <Input placeholder="Profession (optionnel)" {...register("profession")} />
        <Textarea
          className="min-h-24"
          placeholder="Message (optionnel)"
          {...register("message")}
        />
      </div>
      <Button
        className="mt-5 w-full bg-dentova-teal text-dentova-graphite hover:bg-[#5CA8C7]"
        disabled={isSubmitting}
        type="submit"
      >
        <CheckCircle2 className="h-5 w-5" />
        S&apos;inscrire maintenant - {formatPrice(course.price)}
      </Button>
      <p className="mt-5 flex items-center justify-center gap-2 text-center text-sm font-semibold text-white/70">
        <ShieldCheck className="h-4 w-4" />
        Vos informations sont securisees et ne seront jamais partagees.
      </p>
    </form>
  );
}

function FieldError({
  children,
  error
}: {
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <label className="block">
      {children}
      {error ? (
        <span className="mt-1 block text-sm font-semibold text-white">
          {error}
        </span>
      ) : null}
    </label>
  );
}
