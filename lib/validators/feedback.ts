import { z } from "zod";

export const feedbackSchema = z.object({
  fullName: z.string().min(2, "Le nom est requis."),
  email: z.string().email("Email invalide."),
  phone: z.string().optional(),
  courseName: z.string().optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
  message: z.string().min(10, "Votre avis doit contenir au moins 10 caracteres.")
});
