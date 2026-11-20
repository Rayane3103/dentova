import { z } from "zod";

export const signupStatusSchema = z.enum([
  "new",
  "contacted",
  "archived",
  "spam"
]);

export const adminSignupUpdateSchema = z.object({
  id: z.string().min(1),
  status: signupStatusSchema
});
