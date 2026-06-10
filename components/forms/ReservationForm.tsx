"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { SuccessDialog } from "@/components/ui/SuccessDialog";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { formatPrice } from "@/lib/format";
import { reservationSchema } from "@/lib/validators/reservation";
import type { Course } from "@/types";

type ReservationValues = z.infer<typeof reservationSchema>;

const emptyValues = (courseId: string): ReservationValues => ({
  courseId,
  fullName: "",
  email: "",
  phone: "",
  wilaya: "",
  profession: "",
  message: ""
});

export function ReservationForm({ course }: { course: Course }) {
  const [showSuccess, setShowSuccess] = useState(false);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset
  } = useForm<ReservationValues>({
    defaultValues: emptyValues(course.id),
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

    reset(emptyValues(course.id));
    setShowSuccess(true);
  };

  return (
    <>
      <form
        className="rounded-lg border border-white/10 bg-dentova-graphite p-4 text-white shadow-luxe"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-xl font-extrabold leading-tight">Reservez votre place</h2>
        <p className="mt-1.5 text-sm font-semibold text-white/70">
          Places limitees. Inscrivez-vous maintenant pour eviter toute deception.
        </p>
        <div className="mt-3 rounded-lg border border-white/10 bg-white/10 px-3 py-2.5">
          <div className="flex items-center justify-between text-sm font-bold">
            <span>Prix du cours</span>
            <span className="text-dentova-cyan">{formatPrice(course.price)}</span>
          </div>
        </div>
        <input type="hidden" {...register("courseId")} />
        <div className="mt-3 space-y-2">
          <FieldError error={errors.fullName?.message}>
            <Input
              className="h-9 text-sm"
              placeholder="Nom complet"
              {...register("fullName")}
            />
          </FieldError>
          <FieldError error={errors.email?.message}>
            <Input
              className="h-9 text-sm"
              placeholder="Email"
              type="email"
              {...register("email")}
            />
          </FieldError>
          <FieldError error={errors.phone?.message}>
            <Input
              className="h-9 text-sm"
              placeholder="Telephone"
              {...register("phone")}
            />
          </FieldError>
          <FieldError error={errors.wilaya?.message}>
            <Input
              className="h-9 text-sm"
              placeholder="Wilaya"
              {...register("wilaya")}
            />
          </FieldError>
          <Input
            className="h-9 text-sm"
            placeholder="Profession (optionnel)"
            {...register("profession")}
          />
          <Textarea
            className="min-h-16 py-2 text-sm"
            placeholder="Message (optionnel)"
            {...register("message")}
          />
        </div>
        <button
          className="dentova-focus mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-dentova-cyan px-4 py-2.5 text-sm font-bold text-dentova-graphite shadow-md transition hover:bg-dentova-teal-300 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              S&apos;inscrire — {formatPrice(course.price)}
            </>
          )}
        </button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs font-semibold text-white/60">
          <ShieldCheck className="h-3.5 w-3.5" />
          Vos informations sont securisees et ne seront jamais partagees.
        </p>
      </form>

      {showSuccess ? (
        <SuccessDialog
          description="Votre demande de reservation a bien ete envoyee. Notre equipe vous contactera tres bientot pour confirmer votre place."
          onClose={() => setShowSuccess(false)}
          title="Inscription envoyee !"
        />
      ) : null}
    </>
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
        <span className="mt-0.5 block text-xs font-semibold text-dentova-cyan">
          {error}
        </span>
      ) : null}
    </label>
  );
}
