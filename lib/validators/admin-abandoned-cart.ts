import { z } from "zod";

export const abandonedCartStatusSchema = z.enum(["new", "contacted", "lost"]);

export const abandonedCartUpdateSchema = z.object({
  id: z.string().min(1),
  status: abandonedCartStatusSchema
});
