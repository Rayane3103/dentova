import { z } from "zod";

export const workshopImageSchema = z.object({
  active: z.coerce.boolean().default(true),
  description: z.string().optional(),
  imagePublicId: z.string().optional(),
  imageUrl: z.string().url("Image URL is required."),
  order: z.coerce.number().int().min(0).default(0),
  title: z.string().min(2, "Title is required.")
});
