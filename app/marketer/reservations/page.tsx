import type { Metadata } from "next";
import { Ticket } from "lucide-react";
import { MarketerHeader } from "@/components/marketer/MarketerHeader";
import { tryConnectToDatabase } from "@/lib/db/connect";
import { Reservation } from "@/models/Reservation";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Réservations"
};

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  cancelled: "Annulée"
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200"
};

export default async function MarketerReservationsPage() {
  let reservations: Array<Record<string, unknown>> = [];

  if (await tryConnectToDatabase()) {
    reservations = await Reservation.find({})
      .populate("courseId", "title price date")
      .sort({ createdAt: -1 })
      .lean();
  }

  const total = reservations.length;
  const confirmed = reservations.filter((r) => r.status === "confirmed").length;
  const pending = reservations.filter((r) => r.status === "pending").length;

  return (
    <>
      <MarketerHeader
        description="Consultez l'ensemble des réservations de formations"
        icon={Ticket}
        title="Réservations"
      />

      {/* Stats mini-cards */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/40 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-emerald-600">
            Confirmées
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-800">
            {confirmed}
          </p>
        </div>
        <div className="rounded-xl border border-amber-200/60 bg-amber-50/40 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-amber-600">
            En attente
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-amber-800">
            {pending}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200/60 bg-slate-50/40 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
            Total
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-slate-800">
            {total}
          </p>
        </div>
      </div>

      {reservations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center">
          <Ticket className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-sm font-bold text-slate-700">
            Aucune réservation
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Les réservations de formations apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
                    Client
                  </th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
                    Formation
                  </th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
                    Contact
                  </th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
                    Wilaya
                  </th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
                    Statut
                  </th>
                  <th className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {reservations.map((r) => {
                  const course = r.courseId as Record<string, unknown> | null;
                  const status = String(r.status);
                  return (
                    <tr
                      key={String(r._id)}
                      className="transition hover:bg-slate-50/50"
                    >
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-slate-800">
                          {String(r.fullName)}
                        </p>
                        {Boolean(r.profession) && (
                          <p className="mt-0.5 text-xs text-slate-400">
                            {String(r.profession)}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-slate-700">
                          {course?.title
                            ? String(course.title)
                            : "Formation non renseignée"}
                        </p>
                        {Boolean(course?.date) && (
                          <p className="mt-0.5 text-xs text-slate-400">
                            {new Date(String(course?.date)).toLocaleDateString(
                              "fr-FR",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric"
                              }
                            )}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-slate-700">{String(r.email)}</p>
                        {Boolean(r.phone) && (
                          <p className="mt-0.5 text-xs text-slate-400">
                            {String(r.phone)}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-slate-700">
                        {String(r.wilaya)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold",
                            STATUS_STYLES[status] || STATUS_STYLES.pending
                          )}
                        >
                          {STATUS_LABELS[status] || status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right text-xs text-slate-400 whitespace-nowrap tabular-nums">
                        {new Date(String(r.createdAt)).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
