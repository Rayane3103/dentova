import { z } from "zod";

export const categorySchema = z.object({
  description: z.string().optional(),
  name: z.string().min(2, "Name is required."),
  sortOrder: z.coerce.number().int().min(0).optional()
});
