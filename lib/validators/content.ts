import { z } from "zod";

export const faqSchema = z.object({
  answer: z.string().min(5, "Answer is required."),
  category: z.string().default("General"),
  published: z.coerce.boolean().default(true),
  question: z.string().min(5, "Question is required."),
  sortOrder: z.coerce.number().int().default(0)
});

export const mentorSchema = z.object({
  active: z.coerce.boolean().default(true),
  bio: z.string().optional(),
  imagePublicId: z.string().optional(),
  imageUrl: z
    .string()
    .min(1, "Image is required.")
    .refine(
      (value) => value.startsWith("/") || z.string().url().safeParse(value).success,
      "Image must be a valid URL or site path."
    ),
  name: z.string().min(2, "Name is required."),
  order: z.coerce.number().int().default(0),
  showOnHomepage: z.coerce.boolean().default(true),
  specialty: z.string().optional(),
  title: z.string().min(2, "Title is required.")
});
