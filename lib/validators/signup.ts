import { z } from "zod";

export const signupSchema = z.object({
  courseInterest: z.string().optional(),
  email: z.string().email("Email invalide."),
  fullName: z.string().min(2, "Nom complet requis."),
  message: z.string().optional(),
  newsletterOptIn: z.coerce.boolean().default(true),
  phone: z.string().min(5, "Telephone requis."),
  profession: z.string().min(2, "Profession requise."),
  wilaya: z.string().min(2, "Wilaya requise.")
});
