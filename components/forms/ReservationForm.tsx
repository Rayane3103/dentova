"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Briefcase,
  CheckCircle2,
  HelpCircle,
  Loader,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  User
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/utils";
import { reservationSchema } from "@/lib/validators/reservation";
import type { Course, CourseQuestion } from "@/types";

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
  message: "",
  answers: []
});

export function ReservationForm({ course }: { course: Course }) {
  const questions = course.questions ?? [];
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [answerErrors, setAnswerErrors] = useState<Record<string, string>>({});
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset
  } = useForm<ReservationValues>({
    defaultValues: emptyValues(course.id),
    resolver: zodResolver(reservationSchema)
  });

  const setAnswer = (questionId: string, value: string[]) => {
    setAnswers((current) => ({ ...current, [questionId]: value }));
    setAnswerErrors((current) => {
      if (!current[questionId]) return current;
      const next = { ...current };
      delete next[questionId];
      return next;
    });
  };

  const toggleMultiAnswer = (questionId: string, option: string) => {
    const current = answers[questionId] ?? [];
    const next = current.includes(option)
      ? current.filter((item) => item !== option)
      : [...current, option];
    setAnswer(questionId, next);
  };

  const validateAnswers = () => {
    const nextErrors: Record<string, string> = {};

    for (const question of questions) {
      if (!question.required) continue;
      const value = (answers[question.id] ?? []).filter(Boolean);
      if (value.length === 0) {
        nextErrors[question.id] = "Cette question est obligatoire.";
      }
    }

    setAnswerErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async (values: ReservationValues) => {
    if (!validateAnswers()) {
      toast.error("Veuillez répondre aux questions obligatoires.");
      return;
    }

    const payloadAnswers = questions
      .map((question) => ({
        questionId: question.id,
        value: (answers[question.id] ?? []).filter(Boolean)
      }))
      .filter((answer) => answer.value.length > 0);

    const response = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, answers: payloadAnswers })
    });

    if (!response.ok) {
      toast.error("Réservation non envoyée. Réessayez dans un instant.");
      return;
    }

    const data = (await response.json().catch(() => null)) as ReservationResponse | null;
    const reservationId = data?.reservation?._id || data?.reservation?.id;
    const query = reservationId ? `?reservation=${encodeURIComponent(reservationId)}` : "";

    reset(emptyValues(course.id));
    setAnswers({});
    setIsRedirecting(true);
    window.location.assign(`/courses/${course.slug}/thank-you${query}`);
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

          {questions.length > 0 ? (
            <div className="space-y-4 rounded-xl border border-dentova-ash bg-dentova-mint/20 p-4">
              {questions.map((question) => (
                <QuestionField
                  answer={answers[question.id] ?? []}
                  error={answerErrors[question.id]}
                  key={question.id}
                  onSelectMultiple={(option) =>
                    toggleMultiAnswer(question.id, option)
                  }
                  onSelectSingle={(option) =>
                    setAnswer(question.id, option ? [option] : [])
                  }
                  onText={(text) => setAnswer(question.id, text ? [text] : [])}
                  question={question}
                />
              ))}
            </div>
          ) : null}
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

function QuestionField({
  answer,
  error,
  onSelectMultiple,
  onSelectSingle,
  onText,
  question
}: {
  answer: string[];
  error?: string;
  onSelectMultiple: (option: string) => void;
  onSelectSingle: (option: string) => void;
  onText: (text: string) => void;
  question: CourseQuestion;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dentova-muted">
        <HelpCircle className="h-3.5 w-3.5" />
        {question.label}
        {question.required ? (
          <span className="text-dentova-magenta">*</span>
        ) : null}
      </span>

      {question.type === "text" ? (
        <Input
          onChange={(event) => onText(event.target.value)}
          placeholder="Votre réponse"
          value={answer[0] ?? ""}
        />
      ) : null}

      {question.type === "select" && !question.allowMultiple ? (
        <Select
          onChange={(event) => onSelectSingle(event.target.value)}
          value={answer[0] ?? ""}
        >
          <option value="">Sélectionner…</option>
          {question.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      ) : null}

      {question.type === "select" && question.allowMultiple ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {question.options.map((option) => {
            const checked = answer.includes(option);
            return (
              <label
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm font-medium transition",
                  checked
                    ? "border-dentova-teal text-dentova-graphite"
                    : "border-dentova-ash text-dentova-muted hover:border-dentova-teal/50"
                )}
                key={option}
              >
                <Checkbox
                  checked={checked}
                  onChange={() => onSelectMultiple(option)}
                />
                {option}
              </label>
            );
          })}
        </div>
      ) : null}

      {error ? (
        <span className="mt-1 block text-xs font-semibold text-dentova-magenta">
          {error}
        </span>
      ) : null}
    </label>
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
