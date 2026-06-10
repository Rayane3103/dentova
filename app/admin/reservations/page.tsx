import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/Card";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { Reservation } from "@/models/Reservation";

export default async function ReservationsPage() {
  let reservations: Array<Record<string, unknown>> = [];

  if (hasDatabaseConfig()) {
    await connectToDatabase();
    reservations = await Reservation.find({}).populate("courseId").sort({ createdAt: -1 }).lean();
  }

  return (
    <AdminShell>
      <AdminHeader title="Reservations" />
      <div className="mt-8 space-y-4">
        {reservations.length === 0 ? (
          <Card className="p-6 text-dentova-muted">Aucune reservation recue.</Card>
        ) : (
          reservations.map((reservation) => {
            const course = reservation.courseId as Record<string, unknown> | null;

            return (
              <Card className="p-5" key={String(reservation._id)}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-dentova-navy">{String(reservation.fullName)}</p>
                    <p className="text-sm text-dentova-muted">
                      {String(reservation.email)} • {String(reservation.phone)}
                    </p>
                    <p className="mt-2 text-sm text-dentova-ink">
                      Cours: {course?.title ? String(course.title) : "Non renseigne"}
                    </p>
                    <p className="text-sm text-dentova-muted">
                      {String(reservation.profession)} • {String(reservation.wilaya)}
                    </p>
                  </div>
                  <span className="rounded-full bg-dentova-ice px-3 py-1 text-xs font-bold uppercase text-dentova-navy">
                    {String(reservation.status)}
                  </span>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </AdminShell>
  );
}
