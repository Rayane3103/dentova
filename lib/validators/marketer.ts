import { z } from "zod";

// ── Login ──────────────────────────────────────────────

export const marketerLoginSchema = z.object({
  email: z.string().email("Email invalide."),
  password: z.string().min(8, "Mot de passe requis (8 caractères minimum).")
});

// ── Pixel ──────────────────────────────────────────────

const META_PIXEL_REGEX = /^\d{15,16}$/;
const TIKTOK_PIXEL_REGEX = /^[A-Za-z0-9]{15,24}$/;

export const pixelSchema = z.object({
  platform: z.enum(["meta", "tiktok"], {
    required_error: "La plateforme est requise.",
    invalid_type_error: "Plateforme invalide (meta ou tiktok)."
  }),
  pixelId: z
    .string()
    .min(1, "L'ID du pixel est requis.")
    .trim()
    .refine(
      (val) => {
        // Accept both formats — refined per platform later
        return META_PIXEL_REGEX.test(val) || TIKTOK_PIXEL_REGEX.test(val);
      },
      {
        message:
          "Format d'ID pixel invalide. Meta: 15-16 chiffres. TikTok: 15-24 caractères alphanumériques."
      }
    ),
  label: z
    .string()
    .max(100, "Le libellé ne doit pas dépasser 100 caractères.")
    .trim()
    .optional()
    .or(z.literal("")),
  active: z.boolean().optional(),
  notes: z
    .string()
    .max(500, "Les notes ne doivent pas dépasser 500 caractères.")
    .trim()
    .optional()
    .or(z.literal(""))
});

export const pixelUpdateSchema = pixelSchema.partial();

export type MarketerLoginValues = z.infer<typeof marketerLoginSchema>;
export type PixelFormValues = z.infer<typeof pixelSchema>;
