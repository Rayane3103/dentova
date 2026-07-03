import { z } from "zod";

const imageUrlSchema = z
  .string()
  .min(1, "Logo URL is required.")
  .refine(
    (value) => value.startsWith("/") || z.string().url().safeParse(value).success,
    "Logo URL must be a valid URL or site path."
  );

const optionalUrlSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || undefined)
  .refine(
    (value) => !value || z.string().url().safeParse(value).success,
    "Website URL must be a valid URL."
  );

export const sponsorSchema = z.object({
  active: z.coerce.boolean().default(true),
  imagePublicId: z.string().optional(),
  imageUrl: imageUrlSchema,
  name: z.string().min(2, "Name is required."),
  order: z.coerce.number().int().min(0).default(0),
  websiteUrl: optionalUrlSchema
});
