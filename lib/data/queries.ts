import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import {
  serializeCategory,
  serializeCourse,
  serializeFAQ,
  serializeMentor,
  serializeTestimonial,
  serializeWorkshopImage
} from "@/lib/data/serialize";
import { Category } from "@/models/Category";
import { Course } from "@/models/Course";
import { FAQ } from "@/models/FAQ";
import { Feedback } from "@/models/Feedback";
import { Mentor } from "@/models/Mentor";
import { WorkshopImage } from "@/models/WorkshopImage";
import type { Category as CategoryType, Course as CourseType } from "@/types";

async function ensureDb() {
  if (!hasDatabaseConfig()) {
    return false;
  }

  try {
    await connectToDatabase();
    return true;
  } catch (error) {
    console.error("[dentova] MongoDB unavailable:", error);
    return false;
  }
}

function resolveCategory(doc: Record<string, unknown>) {
  const populated = doc.categoryId as Record<string, unknown> | undefined;

  if (populated && populated._id && populated.name) {
    return serializeCategory(populated);
  }

  return {
    id: String(doc.categoryId),
    name: "Non classé",
    slug: "non-classe"
  } satisfies CategoryType;
}

export async function getCategories() {
  if (!(await ensureDb())) {
    return [];
  }

  const categories = await Category.find({}).sort({ sortOrder: 1, name: 1 }).lean();
  return categories.map((doc) => serializeCategory(doc as Record<string, unknown>));
}

export async function getCategoryById(id: string) {
  if (!(await ensureDb())) {
    return null;
  }

  const category = await Category.findById(id).lean();
  return category ? serializeCategory(category as Record<string, unknown>) : null;
}

export async function getPublishedCourses(options?: {
  homepageOnly?: boolean;
  limit?: number;
}) {
  if (!(await ensureDb())) {
    return [] as CourseType[];
  }

  const filter: Record<string, unknown> = { published: true };

  if (options?.homepageOnly) {
    filter.showOnHomepage = true;
  }

  let query = Course.find(filter).sort({ date: 1 }).populate("categoryId");

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const courses = await query.lean();

  return courses.map((doc) =>
    serializeCourse(doc as Record<string, unknown>, resolveCategory(doc as Record<string, unknown>))
  );
}

export async function getAllCourses() {
  if (!(await ensureDb())) {
    return [] as CourseType[];
  }

  const courses = await Course.find({}).sort({ date: 1 }).populate("categoryId").lean();

  return courses.map((doc) =>
    serializeCourse(doc as Record<string, unknown>, resolveCategory(doc as Record<string, unknown>))
  );
}

export async function getCourseBySlug(slug: string) {
  if (!(await ensureDb())) {
    return null;
  }

  const course = await Course.findOne({ slug, published: true }).populate("categoryId").lean();

  if (!course) {
    return null;
  }

  return serializeCourse(
    course as Record<string, unknown>,
    resolveCategory(course as Record<string, unknown>)
  );
}

export async function getCourseById(id: string) {
  if (!(await ensureDb())) {
    return null;
  }

  const course = await Course.findById(id).populate("categoryId").lean();

  if (!course) {
    return null;
  }

  return serializeCourse(
    course as Record<string, unknown>,
    resolveCategory(course as Record<string, unknown>)
  );
}

export async function getCourseAdminRecord(id: string) {
  if (!(await ensureDb())) {
    return null;
  }

  const course = await Course.findById(id).lean();
  return course as Record<string, unknown> | null;
}

export async function getActiveWorkshopImages() {
  if (!(await ensureDb())) {
    return [];
  }

  const images = await WorkshopImage.find({ active: true }).sort({ order: 1 }).lean();
  return images.map((doc) => serializeWorkshopImage(doc as Record<string, unknown>));
}

export async function getPublishedFaqs() {
  if (!(await ensureDb())) {
    return [];
  }

  const faqs = await FAQ.find({ published: true }).sort({ sortOrder: 1 }).lean();
  return faqs.map((doc) => serializeFAQ(doc as Record<string, unknown>));
}

export async function getActiveMentors(homepageOnly = false) {
  if (!(await ensureDb())) {
    return [];
  }

  const filter: Record<string, unknown> = { active: true };

  if (homepageOnly) {
    filter.showOnHomepage = true;
  }

  const mentors = await Mentor.find(filter).sort({ order: 1 }).lean();
  return mentors.map((doc) => serializeMentor(doc as Record<string, unknown>));
}

export async function getPublishedTestimonials() {
  if (!(await ensureDb())) {
    return [];
  }

  const feedback = await Feedback.find({ approved: true, showOnHomepage: true })
    .sort({ createdAt: -1 })
    .lean();

  return feedback.map((doc) => serializeTestimonial(doc as Record<string, unknown>));
}

export async function getAdminStats() {
  if (!(await ensureDb())) {
    return null;
  }

  const [
    courses,
    categories,
    gallery,
    faqs,
    mentors,
    pendingFeedback,
    newMessages,
    subscribers,
    reservations,
    signups
  ] = await Promise.all([
    Course.countDocuments({}),
    Category.countDocuments({}),
    WorkshopImage.countDocuments({}),
    FAQ.countDocuments({}),
    Mentor.countDocuments({}),
    Feedback.countDocuments({ approved: false }),
    import("@/models/ContactMessage").then(({ ContactMessage }) =>
      ContactMessage.countDocuments({ status: "new" })
    ),
    import("@/models/NewsletterSubscriber").then(({ NewsletterSubscriber }) =>
      NewsletterSubscriber.countDocuments({})
    ),
    import("@/models/Reservation").then(({ Reservation }) =>
      Reservation.countDocuments({ status: "pending" })
    ),
    import("@/models/ClientSignup").then(({ ClientSignup }) =>
      ClientSignup.countDocuments({})
    )
  ]);

  return {
    courses,
    categories,
    gallery,
    faqs,
    mentors,
    pendingFeedback,
    newMessages,
    subscribers,
    reservations,
    signups
  };
}
