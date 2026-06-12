import { z } from "zod";

export const postSchema = z.object({
  caption: z.string().min(2, "La légende est requise."),
  content: z.string().min(10, "Le contenu doit faire au moins 10 caractères."),
  imagePublicId: z.string().optional(),
  imageUrl: z
    .string()
    .min(1, "L'image est requise.")
    .refine(
      (value) => value.startsWith("/") || z.string().url().safeParse(value).success,
      "L'image doit être une URL valide ou un chemin local."
    ),
  published: z.coerce.boolean().default(true),
  slug: z.string().min(2, "Le slug est requis.")
});
