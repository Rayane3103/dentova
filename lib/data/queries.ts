import { tryConnectToDatabase } from "@/lib/db/connect";
import {
  serializeCategory,
  serializeCourse,
  serializeFAQ,
  serializeMentor,
  serializePost,
  serializeSponsor,
  serializeTestimonial,
  serializeWorkshopImage
} from "@/lib/data/serialize";
import { Category } from "@/models/Category";
import { Course } from "@/models/Course";
import { FAQ } from "@/models/FAQ";
import { Feedback } from "@/models/Feedback";
import { Mentor } from "@/models/Mentor";
import { Post } from "@/models/Post";
import { Sponsor } from "@/models/Sponsor";
import { WorkshopImage } from "@/models/WorkshopImage";
import type { BlogPost, Category as CategoryType, Course as CourseType } from "@/types";

async function ensureDb() {
  return tryConnectToDatabase();
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

export async function getUpcomingCourses(limit = 3) {
  if (!(await ensureDb())) {
    return [] as CourseType[];
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const courses = await Course.find({ published: true, date: { $gte: now } })
    .sort({ date: 1 })
    .limit(limit)
    .populate("categoryId")
    .lean();

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

export async function getActiveSponsors() {
  if (!(await ensureDb())) {
    return [];
  }

  const sponsors = await Sponsor.find({ active: true }).sort({ order: 1, name: 1 }).lean();
  return sponsors.map((doc) => serializeSponsor(doc as Record<string, unknown>));
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

export async function getPublishedPosts(options?: {
  limit?: number;
}) {
  if (!(await ensureDb())) {
    return [] as BlogPost[];
  }

  let query = Post.find({ published: true }).sort({ createdAt: -1 });

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const posts = await query.lean();

  return posts.map((doc) => serializePost(doc as Record<string, unknown>));
}

export async function getAllPosts() {
  if (!(await ensureDb())) {
    return [] as BlogPost[];
  }

  const posts = await Post.find({}).sort({ createdAt: -1 }).lean();

  return posts.map((doc) => serializePost(doc as Record<string, unknown>));
}

export async function getPostBySlug(slug: string) {
  if (!(await ensureDb())) {
    return null;
  }

  const post = await Post.findOne({ slug, published: true }).lean();

  if (!post) {
    return null;
  }

  return serializePost(post as Record<string, unknown>);
}

export async function getPostById(id: string) {
  if (!(await ensureDb())) {
    return null;
  }

  const post = await Post.findById(id).lean();

  if (!post) {
    return null;
  }

  return serializePost(post as Record<string, unknown>);
}

export async function getPostAdminRecord(id: string) {
  if (!(await ensureDb())) {
    return null;
  }

  const post = await Post.findById(id).lean();
  return post as Record<string, unknown> | null;
}

export async function getAdminStats() {
  if (!(await ensureDb())) {
    return null;
  }

  const [
    courses,
    categories,
    gallery,
    sponsors,
    faqs,
    mentors,
    posts,
    pendingFeedback,
    newMessages,
    subscribers,
    reservations,
    signups
  ] = await Promise.all([
    Course.countDocuments({}),
    Category.countDocuments({}),
    WorkshopImage.countDocuments({}),
    Sponsor.countDocuments({}),
    FAQ.countDocuments({}),
    Mentor.countDocuments({}),
    Post.countDocuments({}),
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
    sponsors,
    faqs,
    mentors,
    posts,
    pendingFeedback,
    newMessages,
    subscribers,
    reservations,
    signups
  };
}

// ── Marketer Analytics ──────────────────────────────────

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

export async function getMarketerStats() {
  if (!(await ensureDb())) {
    return null;
  }

  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(
    new Date(now.getFullYear(), now.getMonth() - 1, 1)
  );
  const lastMonthEnd = endOfMonth(
    new Date(now.getFullYear(), now.getMonth() - 1, 1)
  );

  // Dynamic imports for models not already imported
  const [
    { Reservation },
    { ClientSignup },
    { NewsletterSubscriber },
    { ContactMessage }
  ] = await Promise.all([
    import("@/models/Reservation"),
    import("@/models/ClientSignup"),
    import("@/models/NewsletterSubscriber"),
    import("@/models/ContactMessage")
  ]);

  const [
    courses,
    publishedCourses,
    reservations,
    reservationsThisMonth,
    reservationsLastMonth,
    confirmedReservations,
    pendingReservations,
    signups,
    signupsThisMonth,
    subscribers,
    subscribersThisMonth,
    messages,
    newMessages,
    pendingFeedback,
    topCoursesData
  ] = await Promise.all([
    Course.countDocuments({}),
    Course.countDocuments({ published: true }),
    Reservation.countDocuments({}),
    Reservation.countDocuments({
      createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd }
    }),
    Reservation.countDocuments({
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
    }),
    Reservation.countDocuments({ status: "confirmed" }),
    Reservation.countDocuments({ status: "pending" }),
    ClientSignup.countDocuments({}),
    ClientSignup.countDocuments({
      createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd }
    }),
    NewsletterSubscriber.countDocuments({}),
    NewsletterSubscriber.countDocuments({
      createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd }
    }),
    ContactMessage.countDocuments({}),
    ContactMessage.countDocuments({ status: "new" }),
    Feedback.countDocuments({ approved: false }),
    // Top courses by reservations (aggregation)
    Reservation.aggregate([
      { $group: { _id: "$courseId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "course"
        }
      },
      { $unwind: { path: "$course", preserveNullAndEmptyArrays: true } }
    ])
  ]);

  // Reservations by month (last 6 months)
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const reservationsByMonthRaw = await Reservation.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);

  const monthNames = [
    "Jan", "Fév", "Mar", "Avr", "Mai", "Jun",
    "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"
  ];

  const reservationsByMonth = reservationsByMonthRaw.map((r) => ({
    month: `${monthNames[r._id.month - 1]} ${r._id.year}`,
    count: r.count
  }));

  // Format top courses
  const topCoursesByReservations = topCoursesData
    .filter((item) => item.course)
    .map((item) => ({
      courseId: String(item._id),
      title: item.course?.title || "Formation supprimée",
      count: item.count,
      imageUrl: item.course?.imageUrl || "",
      date: item.course?.date
        ? new Date(item.course.date).toISOString().slice(0, 10)
        : ""
    }));

  return {
    courses,
    publishedCourses,
    reservations,
    reservationsThisMonth,
    reservationsLastMonth,
    confirmedReservations,
    pendingReservations,
    signups,
    signupsThisMonth,
    subscribers,
    subscribersThisMonth,
    messages,
    newMessages,
    pendingFeedback,
    topCoursesByReservations,
    reservationsByMonth
  };
}
