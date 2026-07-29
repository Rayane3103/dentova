import type { AbandonedCartRecord, AbandonedCartStatus } from "@/types";

/** Idle time after which an unconverted draft is treated as abandoned. */
export const ABANDON_THRESHOLD_MINUTES = 5;

export const ABANDONED_CARTS_PAGE_SIZE = 25;

/** Required reservation fields — drives the "x/4 champs" progress column. */
const REQUIRED_FIELDS = ["fullName", "email", "phone", "wilaya"] as const;

export const ABANDONED_CART_TOTAL_FIELDS = REQUIRED_FIELDS.length;

/** Cut-off timestamp: drafts last touched before this count as abandoned. */
export function abandonedBefore(now: Date = new Date()) {
  return new Date(now.getTime() - ABANDON_THRESHOLD_MINUTES * 60_000);
}

function countFilledFields(doc: Record<string, unknown>) {
  return REQUIRED_FIELDS.filter((field) =>
    String(doc[field] ?? "").trim().length > 0
  ).length;
}

/** Converts a populated AbandonedCart Mongo doc into the admin table shape. */
export function serializeAbandonedCartRecord(
  doc: Record<string, unknown>
): AbandonedCartRecord {
  const course = doc.courseId as Record<string, unknown> | null;

  return {
    id: String(doc._id),
    courseId: course?._id ? String(course._id) : String(doc.courseId),
    courseTitle: course?.title ? String(course.title) : "Formation non renseignée",
    createdAt: String(doc.createdAt),
    email: doc.email ? String(doc.email) : "",
    fullName: doc.fullName ? String(doc.fullName) : "",
    phone: doc.phone ? String(doc.phone) : "",
    profession: doc.profession ? String(doc.profession) : undefined,
    wilaya: doc.wilaya ? String(doc.wilaya) : undefined,
    message: doc.message ? String(doc.message) : undefined,
    attempts: Number(doc.attempts) || 1,
    filledFields: countFilledFields(doc),
    totalFields: ABANDONED_CART_TOTAL_FIELDS,
    status: (doc.status as AbandonedCartStatus) ?? "new",
    lastActivityAt: String(doc.lastActivityAt)
  };
}

export type AbandonedCartStatusCounts = {
  all: number;
  new: number;
  contacted: number;
  lost: number;
};

export function emptyAbandonedCartCounts(): AbandonedCartStatusCounts {
  return { all: 0, new: 0, contacted: 0, lost: 0 };
}

export function abandonedCountsFromAggregate(
  aggregate: { _id: string; count: number }[]
): AbandonedCartStatusCounts {
  const counts = emptyAbandonedCartCounts();

  for (const entry of aggregate) {
    const count = Number(entry.count) || 0;
    counts.all += count;
    if (entry._id === "new") counts.new = count;
    if (entry._id === "contacted") counts.contacted = count;
    if (entry._id === "lost") counts.lost = count;
  }

  return counts;
}

/**
 * Builds the Mongo filter shared by the list and count queries. "Abandoned" is
 * derived here — never stored — so the list is always accurate without a job.
 */
export function buildAbandonedCartFilter(params: {
  q?: string | null;
  status?: string | null;
  courseId?: string | null;
}): Record<string, unknown> {
  const filter: Record<string, unknown> = {
    converted: false,
    lastActivityAt: { $lte: abandonedBefore() }
  };

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
    filter.$or = [{ fullName: rx }, { email: rx }, { phone: rx }, { wilaya: rx }];
  }

  return filter;
}
