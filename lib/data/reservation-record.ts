import type { ReservationRecord } from "@/components/admin/ReservationsCRM";
import { serializeReservationAnswers } from "@/lib/data/serialize";

/** Converts a populated Reservation Mongo doc into the admin table shape. */
export function serializeReservationRecord(
  doc: Record<string, unknown>
): ReservationRecord {
  const course = doc.courseId as Record<string, unknown> | null;

  return {
    id: String(doc._id),
    courseId: course?._id ? String(course._id) : String(doc.courseId),
    courseTitle: course?.title ? String(course.title) : "Formation non renseignée",
    coursePrice: course?.price != null ? Number(course.price) : undefined,
    courseDate: course?.date ? new Date(String(course.date)).toISOString() : undefined,
    courseTime: course?.time ? String(course.time) : undefined,
    courseLocation: course?.location ? String(course.location) : undefined,
    createdAt: String(doc.createdAt),
    email: String(doc.email),
    fullName: String(doc.fullName),
    message: doc.message ? String(doc.message) : undefined,
    phone: String(doc.phone),
    profession: doc.profession ? String(doc.profession) : undefined,
    status: doc.status as ReservationRecord["status"],
    answers: serializeReservationAnswers(doc.answers),
    updatedAt: doc.updatedAt ? String(doc.updatedAt) : undefined,
    wilaya: String(doc.wilaya)
  };
}

export type ReservationStatusCounts = {
  all: number;
  pending: number;
  confirmed: number;
  paid: number;
  cancelled: number;
};

export function emptyStatusCounts(): ReservationStatusCounts {
  return { all: 0, pending: 0, confirmed: 0, paid: 0, cancelled: 0 };
}

export function countsFromAggregate(
  aggregate: { _id: string; count: number }[]
): ReservationStatusCounts {
  const counts = emptyStatusCounts();

  for (const entry of aggregate) {
    const count = Number(entry.count) || 0;
    counts.all += count;
    if (entry._id === "pending") counts.pending = count;
    if (entry._id === "confirmed") counts.confirmed = count;
    if (entry._id === "paid") counts.paid = count;
    if (entry._id === "cancelled") counts.cancelled = count;
  }

  return counts;
}

export const RESERVATIONS_PAGE_SIZE = 25;

/** Builds the Mongo filter shared by list, count, and export queries. */
export function buildReservationFilter(params: {
  q?: string | null;
  status?: string | null;
  courseId?: string | null;
}): Record<string, unknown> {
  const filter: Record<string, unknown> = {};

  if (params.status && params.status !== "all") {
    filter.status = params.status;
  }

  if (params.courseId && params.courseId !== "all") {
    filter.courseId = params.courseId;
  }

  const query = params.q?.trim();
  if (query) {
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const rx = new RegExp(escaped, "i");
    filter.$or = [
      { fullName: rx },
      { email: rx },
      { phone: rx },
      { wilaya: rx }
    ];
  }

  return filter;
}
