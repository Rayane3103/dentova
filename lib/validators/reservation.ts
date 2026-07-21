import { z } from "zod";

export const reservationAnswerSchema = z.object({
  questionId: z.string().min(1),
  value: z.array(z.string()).default([])
});

export const reservationSchema = z.object({
  courseId: z.string().min(1),
  fullName: z.string().min(2, "Le nom complet est requis."),
  email: z.string().email("Email invalide."),
  phone: z.string().min(6, "Telephone requis."),
  wilaya: z.string().min(2, "Wilaya requise."),
  profession: z.string().optional(),
  message: z.string().optional(),
  answers: z.array(reservationAnswerSchema).default([])
});
