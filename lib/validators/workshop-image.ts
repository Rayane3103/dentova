import { z } from "zod";

const imageUrlSchema = z
  .string()
  .min(1, "Image URL is required.")
  .refine(
    (value) => value.startsWith("/") || z.string().url().safeParse(value).success,
    "Image URL must be a valid URL or site path."
  );

export const workshopImageSchema = z.object({
  active: z.coerce.boolean().default(true),
  description: z.string().optional(),
  imagePublicId: z.string().optional(),
  imageUrl: imageUrlSchema,
  order: z.coerce.number().int().min(0).default(0),
  title: z.string().min(2, "Title is required.")
});
