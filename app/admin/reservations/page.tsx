import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  ReservationsCRM,
  type ReservationRecord
} from "@/components/admin/ReservationsCRM";
import { ReservationsSheetButton } from "@/components/admin/ReservationsSheetButton";
import {
  countsFromAggregate,
  emptyStatusCounts,
  RESERVATIONS_PAGE_SIZE,
  type ReservationStatusCounts,
  serializeReservationRecord
} from "@/lib/data/reservation-record";
import { tryConnectToDatabase } from "@/lib/db/connect";
import { hasGoogleSheetsConfig } from "@/lib/integrations/google-sheets";
import { getReservationsSheetLink } from "@/lib/integrations/reservations-sheet";
import { Course } from "@/models/Course";
import { Reservation } from "@/models/Reservation";

export default async function ReservationsPage() {
  let reservations: ReservationRecord[] = [];
  let total = 0;
  let counts: ReservationStatusCounts = emptyStatusCounts();
  let courses: Array<{
    id: string;
    title: string;
    price: number;
    date?: string;
    time?: string;
    location?: string;
  }> = [];

  if (await tryConnectToDatabase()) {
    const [reservationDocs, totalCount, aggregate, courseDocs] = await Promise.all([
      Reservation.find({})
        .populate("courseId")
        .sort({ createdAt: -1 })
        .limit(RESERVATIONS_PAGE_SIZE)
        .lean(),
      Reservation.countDocuments({}),
      Reservation.aggregate<{ _id: string; count: number }>([
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]),
      Course.find({}).sort({ title: 1 }).select("_id title price date time location").lean()
    ]);

    reservations = reservationDocs.map((doc) =>
      serializeReservationRecord(doc as Record<string, unknown>)
    );
    total = totalCount;
    counts = countsFromAggregate(aggregate);
    courses = courseDocs.map((doc) => ({
      id: String(doc._id),
      title: String(doc.title),
      price: Number(doc.price),
      date: doc.date ? new Date(String(doc.date)).toISOString() : undefined,
      time: doc.time ? String(doc.time) : undefined,
      location: doc.location ? String(doc.location) : undefined
    }));
  }

  const sheetLink = await getReservationsSheetLink();

  return (
    <>
      <AdminHeader
        actions={
          <ReservationsSheetButton
            configured={hasGoogleSheetsConfig()}
            initialLink={sheetLink}
          />
        }
        description="Gestion CRM des reservations de cours avec filtres, statuts et edition detaillee."
        title="Reservations"
      />
      <ReservationsCRM
        courses={courses}
        initialCounts={counts}
        initialReservations={reservations}
        initialTotal={total}
        pageSize={RESERVATIONS_PAGE_SIZE}
      />
    </>
  );
}
