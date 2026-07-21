import { z } from "zod";
import { getYouTubeVideoId } from "@/lib/youtube";

const imageUrlSchema = z
  .string()
  .min(1, "Image URL is required.")
  .refine(
    (value) => value.startsWith("/") || z.string().url().safeParse(value).success,
    "Image URL must be a valid URL or site path."
  );

const courseTypeSchema = z.enum(["formation", "cycle"]);

export const courseQuestionSchema = z
  .object({
    id: z.string().min(1),
    label: z.string().trim().min(1, "L'intitulé de la question est requis."),
    type: z.enum(["text", "select"]).default("text"),
    required: z.coerce.boolean().default(false),
    options: z.array(z.string().trim().min(1)).default([]),
    allowMultiple: z.coerce.boolean().default(false)
  })
  .superRefine((question, ctx) => {
    if (question.type === "select" && question.options.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ajoutez au moins une option pour une question à choix.",
        path: ["options"]
      });
    }
  });

const youtubeUrlSchema = z.string().trim().optional().refine(
  (value) => !value || Boolean(getYouTubeVideoId(value)),
  "YouTube link must be a valid YouTube video URL."
);

const baseCourseSchema = z.object({
  categoryId: z.string().min(1, "Category is required."),
  contactEmail: z.string().email("Contact email is invalid."),
  contactPhone: z.string().min(5, "Contact phone is required."),
  courseType: courseTypeSchema.default("formation"),
  cycleDates: z.preprocess(
    (value) =>
      Array.isArray(value) ? value.filter((item) => item != null && item !== "") : value,
    z.array(z.coerce.date()).optional()
  ),
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
  questions: z.array(courseQuestionSchema).default([]),
  published: z.coerce.boolean().default(true),
  showOnHomepage: z.coerce.boolean().default(true),
  subtitle: z.string().optional(),
  time: z.string().optional(),
  title: z.string().min(2, "Title is required."),
  youtubeUrl: youtubeUrlSchema
});

function validateCycleDates(
  data: { courseType?: "formation" | "cycle"; cycleDates?: Date[] },
  ctx: z.RefinementCtx
) {
  if (data.courseType === "cycle" && (!data.cycleDates || data.cycleDates.length < 2)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "A cycle requires at least two dates.",
      path: ["cycleDates"]
    });
  }
}

export const courseSchema = baseCourseSchema.superRefine(validateCycleDates);

export const courseUpdateSchema = baseCourseSchema.partial().superRefine(validateCycleDates);
