import { z } from "zod";

export const reservationStatusSchema = z.enum(["pending", "confirmed", "cancelled"]);

export const adminReservationUpdateSchema = z.object({
  id: z.string().min(1),
  courseId: z.string().min(1).optional(),
  email: z.string().email("Email invalide.").optional(),
  fullName: z.string().min(2, "Nom requis.").optional(),
  message: z.string().optional(),
  phone: z.string().min(6, "Telephone requis.").optional(),
  profession: z.string().optional(),
  status: reservationStatusSchema.optional(),
  wilaya: z.string().min(2, "Wilaya requise.").optional()
});
