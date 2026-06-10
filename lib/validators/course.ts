import { z } from "zod";

export const courseSchema = z.object({
  categoryId: z.string().min(1, "Category is required."),
  contactEmail: z.string().email("Contact email is invalid."),
  contactPhone: z.string().min(5, "Contact phone is required."),
  date: z.coerce.date(),
  description: z.string().min(10, "Description is required."),
  featured: z.coerce.boolean().default(false),
  imagePublicId: z.string().optional(),
  imageUrl: z.string().url("Image URL is required."),
  instructor: z.string().min(2, "Instructor is required."),
  location: z.string().min(2, "Location is required."),
  maxSeats: z.coerce.number().int().positive().optional(),
  price: z.coerce.number().min(0),
  published: z.coerce.boolean().default(true),
  showOnHomepage: z.coerce.boolean().default(true),
  time: z.string().optional(),
  title: z.string().min(2, "Title is required.")
});
