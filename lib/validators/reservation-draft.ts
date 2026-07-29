import { z } from "zod";

/**
 * Capture gate: a draft is only ever stored once the visitor has supplied a
 * usable way to reach them. Exported so the client hook and the API route
 * enforce the exact same rule.
 */
export function isUsableEmail(value?: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((value ?? "").trim());
}

export function isUsablePhone(value?: string) {
  return (value ?? "").replace(/\D/g, "").length >= 8;
}

export function hasUsableContact(input: { email?: string; phone?: string }) {
  return isUsableEmail(input.email) || isUsablePhone(input.phone);
}

export const reservationDraftAnswerSchema = z.object({
  questionId: z.string().min(1).max(120),
  value: z.array(z.string().max(500)).max(50).default([])
});

export const reservationDraftSchema = z
  .object({
    courseId: z.string().min(1).max(64),
    sessionKey: z.string().min(8).max(64),
    email: z.string().trim().max(160).optional(),
    fullName: z.string().trim().max(160).optional(),
    message: z.string().trim().max(2000).optional(),
    phone: z.string().trim().max(40).optional(),
    profession: z.string().trim().max(160).optional(),
    wilaya: z.string().trim().max(120).optional(),
    answers: z.array(reservationDraftAnswerSchema).max(50).default([])
  })
  .refine(hasUsableContact, {
    message: "Un email ou un telephone valide est requis.",
    path: ["email"]
  });
