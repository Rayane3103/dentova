import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  ReservationsCRM,
  type ReservationRecord
} from "@/components/admin/ReservationsCRM";
import { tryConnectToDatabase } from "@/lib/db/connect";
import { Course } from "@/models/Course";
import { Reservation } from "@/models/Reservation";

function serializeReservation(doc: Record<string, unknown>): ReservationRecord {
  const course = doc.courseId as Record<string, unknown> | null;

  return {
    id: String(doc._id),
    courseId: course?._id ? String(course._id) : String(doc.courseId),
    courseTitle: course?.title ? String(course.title) : "Formation non renseignee",
    createdAt: String(doc.createdAt),
    email: String(doc.email),
    fullName: String(doc.fullName),
    message: doc.message ? String(doc.message) : undefined,
    phone: String(doc.phone),
    profession: doc.profession ? String(doc.profession) : undefined,
    status: doc.status as ReservationRecord["status"],
    updatedAt: doc.updatedAt ? String(doc.updatedAt) : undefined,
    wilaya: String(doc.wilaya)
  };
}

export default async function ReservationsPage() {
  let reservations: ReservationRecord[] = [];
  let courses: Array<{ id: string; title: string }> = [];

  if (await tryConnectToDatabase()) {
    const [reservationDocs, courseDocs] = await Promise.all([
      Reservation.find({}).populate("courseId").sort({ createdAt: -1 }).lean(),
      Course.find({}).sort({ title: 1 }).select("_id title").lean()
    ]);

    reservations = reservationDocs.map((doc) =>
      serializeReservation(doc as Record<string, unknown>)
    );
    courses = courseDocs.map((doc) => ({
      id: String(doc._id),
      title: String(doc.title)
    }));
  }

  return (
    <AdminShell>
      <AdminHeader
        description="Gestion CRM des reservations de cours avec filtres, statuts et edition detaillee."
        title="Reservations"
      />
      <ReservationsCRM courses={courses} initialReservations={reservations} />
    </AdminShell>
  );
}
