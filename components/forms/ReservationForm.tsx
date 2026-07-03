"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Briefcase,
  CheckCircle2,
  Loader,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  User
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { reservationSchema } from "@/lib/validators/reservation";
import type { Course } from "@/types";

type ReservationValues = z.infer<typeof reservationSchema>;
type ReservationResponse = {
  reservation?: {
    _id?: string;
    id?: string;
  };
};

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
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
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
      toast.error("Réservation non envoyée. Réessayez dans un instant.");
      return;
    }

    const data = (await response.json().catch(() => null)) as ReservationResponse | null;
    const reservationId = data?.reservation?._id || data?.reservation?.id;
    const query = reservationId ? `?reservation=${encodeURIComponent(reservationId)}` : "";

    reset(emptyValues(course.id));
    setIsRedirecting(true);
    router.push(`/courses/${course.slug}/thank-you${query}`);
  };

  return (
    <form
      className="rounded-2xl border border-dentova-ash bg-white p-6 shadow-card"
      onSubmit={handleSubmit(onSubmit)}
    >
        <div className="mb-5">
          <h2 className="text-lg font-extrabold text-dentova-graphite">
            Réservez votre place
          </h2>
          <p className="mt-1 text-sm font-medium text-dentova-muted">
            Remplissez le formulaire ci-dessous. Notre équipe vous contactera
            pour confirmer votre inscription.
          </p>
        </div>

        <input type="hidden" {...register("courseId")} />

        <div className="space-y-4">
          <Field
            error={errors.fullName?.message}
            icon={User}
            label="Nom complet"
            required
          >
            <Input
              placeholder="Votre nom et prénom"
              {...register("fullName")}
            />
          </Field>

          <Field
            error={errors.email?.message}
            icon={Mail}
            label="Email"
            required
          >
            <Input
              placeholder="votre@email.com"
              type="email"
              {...register("email")}
            />
          </Field>

          <Field
            error={errors.phone?.message}
            icon={Phone}
            label="Téléphone"
            required
          >
            <Input
              placeholder="05 XX XX XX XX"
              {...register("phone")}
            />
          </Field>

          <Field
            error={errors.wilaya?.message}
            icon={MapPin}
            label="Wilaya"
            required
          >
            <Input
              placeholder="Votre wilaya"
              {...register("wilaya")}
            />
          </Field>

          <Field icon={Briefcase} label="Profession">
            <Input
              placeholder="Votre profession (optionnel)"
              {...register("profession")}
            />
          </Field>

          <Field icon={MessageSquare} label="Message">
            <Textarea
              className="min-h-[80px]"
              placeholder="Un message ou une question ? (optionnel)"
              {...register("message")}
            />
          </Field>
        </div>

        <button
          className="dentova-focus mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-dentova-graphite px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-dentova-graphite/90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting || isRedirecting}
          type="submit"
        >
          {isSubmitting || isRedirecting ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              Envoi en cours…
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Confirmer l&apos;inscription
            </>
          )}
        </button>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs font-medium text-dentova-muted">
          <ShieldCheck className="h-3.5 w-3.5 text-dentova-teal" />
          Vos informations sont sécurisées et ne seront jamais partagées.
        </p>
    </form>
  );
}

function Field({
  children,
  error,
  icon: Icon,
  label,
  required
}: {
  children: React.ReactNode;
  error?: string;
  icon: typeof User;
  label: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dentova-muted">
        <Icon className="h-3.5 w-3.5" />
        {label}
        {required ? (
          <span className="text-dentova-magenta">*</span>
        ) : null}
      </span>
      {children}
      {error ? (
        <span className="mt-1 block text-xs font-semibold text-dentova-magenta">
          {error}
        </span>
      ) : null}
    </label>
  );
}
