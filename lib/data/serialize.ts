import type { Category, Course, FAQItem, Mentor, Testimonial, WorkshopImage } from "@/types";

type MongoDoc = Record<string, unknown>;

export function serializeCategory(doc: MongoDoc): Category {
  return {
    id: String(doc._id),
    name: String(doc.name),
    slug: String(doc.slug),
    description: doc.description ? String(doc.description) : undefined,
    sortOrder: typeof doc.sortOrder === "number" ? doc.sortOrder : undefined
  };
}

function formatDate(value: unknown) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return String(value).slice(0, 10);
}

export function serializeCourse(doc: MongoDoc, category: Category): Course {
  const description = String(doc.description);

  return {
    id: String(doc._id),
    title: String(doc.title),
    slug: String(doc.slug),
    subtitle: doc.subtitle ? String(doc.subtitle) : undefined,
    description,
    excerpt: doc.excerpt ? String(doc.excerpt) : description.slice(0, 160),
    category,
    instructor: String(doc.instructor),
    date: formatDate(doc.date),
    time: doc.time ? String(doc.time) : undefined,
    location: String(doc.location),
    price: Number(doc.price),
    contactPhone: String(doc.contactPhone),
    contactEmail: String(doc.contactEmail),
    imageUrl: String(doc.imageUrl),
    imagePublicId: doc.imagePublicId ? String(doc.imagePublicId) : undefined,
    featured: Boolean(doc.featured),
    showOnHomepage: Boolean(doc.showOnHomepage),
    published: Boolean(doc.published),
    maxSeats: doc.maxSeats ? Number(doc.maxSeats) : undefined
  };
}

export function serializeWorkshopImage(doc: MongoDoc): WorkshopImage {
  return {
    id: String(doc._id),
    title: String(doc.title),
    description: doc.description ? String(doc.description) : undefined,
    imageUrl: String(doc.imageUrl),
    imagePublicId: doc.imagePublicId ? String(doc.imagePublicId) : undefined,
    order: Number(doc.order ?? 0),
    active: Boolean(doc.active)
  };
}

export function serializeFAQ(doc: MongoDoc): FAQItem & { id: string; sortOrder: number; published: boolean } {
  return {
    id: String(doc._id),
    question: String(doc.question),
    answer: String(doc.answer),
    category: doc.category ? String(doc.category) : "General",
    sortOrder: Number(doc.sortOrder ?? 0),
    published: Boolean(doc.published ?? true)
  };
}

export function serializeMentor(doc: MongoDoc): Mentor {
  return {
    id: String(doc._id),
    name: String(doc.name),
    title: String(doc.title),
    bio: doc.bio ? String(doc.bio) : undefined,
    specialty: doc.specialty ? String(doc.specialty) : undefined,
    imageUrl: String(doc.imageUrl),
    imagePublicId: doc.imagePublicId ? String(doc.imagePublicId) : undefined,
    order: Number(doc.order ?? 0),
    active: Boolean(doc.active ?? true),
    showOnHomepage: Boolean(doc.showOnHomepage ?? true)
  };
}

export function serializeTestimonial(doc: MongoDoc): Testimonial {
  return {
    id: String(doc._id),
    fullName: String(doc.fullName),
    role: doc.role ? String(doc.role) : "Participant",
    message: String(doc.message),
    rating: Number(doc.rating ?? 5)
  };
}
