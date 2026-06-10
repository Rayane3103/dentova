import { z } from "zod";

const imageUrlSchema = z
  .string()
  .min(1, "Image URL is required.")
  .refine(
    (value) => value.startsWith("/") || z.string().url().safeParse(value).success,
    "Image URL must be a valid URL or site path."
  );

export const courseSchema = z.object({
  categoryId: z.string().min(1, "Category is required."),
  contactEmail: z.string().email("Contact email is invalid."),
  contactPhone: z.string().min(5, "Contact phone is required."),
  date: z.coerce.date(),
  description: z.string().min(10, "Description is required."),
  excerpt: z.string().optional(),
  featured: z.coerce.boolean().default(false),
  imagePublicId: z.string().optional(),
  imageUrl: imageUrlSchema,
  instructor: z.string().min(2, "Instructor is required."),
  location: z.string().min(2, "Location is required."),
  maxSeats: z.coerce.number().int().positive().optional(),
  price: z.coerce.number().min(0),
  published: z.coerce.boolean().default(true),
  showOnHomepage: z.coerce.boolean().default(true),
  subtitle: z.string().optional(),
  time: z.string().optional(),
  title: z.string().min(2, "Title is required.")
});
