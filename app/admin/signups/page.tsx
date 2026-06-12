import { Mail, Phone, User } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { tryConnectToDatabase } from "@/lib/db/connect";
import { ClientSignup } from "@/models/ClientSignup";
import { Reservation } from "@/models/Reservation";

type SignupEntry = {
  id: string;
  kind: "general" | "course";
  fullName: string;
  email: string;
  phone: string;
  profession?: string;
  wilaya?: string;
  courseLabel?: string;
  message?: string;
  status: string;
  createdAt?: Date;
};

export default async function SignupsPage() {
  let entries: SignupEntry[] = [];

  if (await tryConnectToDatabase()) {
    const [signups, reservations] = await Promise.all([
      ClientSignup.find({}).sort({ createdAt: -1 }).lean(),
      Reservation.find({}).populate("courseId").sort({ createdAt: -1 }).lean()
    ]);

    entries = [
      ...signups.map((signup) => ({
        id: String(signup._id),
        kind: "general" as const,
        fullName: String(signup.fullName),
        email: String(signup.email),
        phone: String(signup.phone ?? ""),
        profession: signup.profession ? String(signup.profession) : undefined,
        wilaya: signup.wilaya ? String(signup.wilaya) : undefined,
        courseLabel: signup.courseInterest ? String(signup.courseInterest) : undefined,
        message: signup.message ? String(signup.message) : undefined,
        status: String(signup.status),
        createdAt: signup.createdAt as Date | undefined
      })),
      ...reservations.map((reservation) => {
        const course = reservation.courseId as Record<string, unknown> | null;
        return {
          id: String(reservation._id),
          kind: "course" as const,
          fullName: String(reservation.fullName),
          email: String(reservation.email),
          phone: String(reservation.phone),
          profession: reservation.profession ? String(reservation.profession) : undefined,
          wilaya: reservation.wilaya ? String(reservation.wilaya) : undefined,
          courseLabel: course?.title ? String(course.title) : "Formation non renseignée",
          message: reservation.message ? String(reservation.message) : undefined,
          status: String(reservation.status),
          createdAt: reservation.createdAt as Date | undefined
        };
      })
    ].sort(
      (left, right) =>
        new Date(right.createdAt ?? 0).getTime() - new Date(left.createdAt ?? 0).getTime()
    );
  }

  return (
    <>
      <AdminHeader
        description="Demandes générales et réservations de cours reçues depuis le site"
        title="Inscriptions"
      />
      <div className="space-y-3">
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <User className="h-7 w-7 text-slate-400" />
            </div>
            <h3 className="mt-5 text-base font-bold text-slate-800">
              Aucune inscription
            </h3>
            <p className="mt-1.5 text-sm text-slate-500">
              Les inscriptions apparaîtront ici.
            </p>
          </div>
        ) : (
          entries.map((entry) => (
            <div
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              key={`${entry.kind}-${entry.id}`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <StatusBadge
                      variant={entry.kind === "course" ? "confirmed" : "new"}
                      label={
                        entry.kind === "course"
                          ? "Réservation"
                          : "Inscription"
                      }
                    />
                    <span className="text-sm font-bold text-slate-800">
                      {entry.fullName}
                    </span>
                  </div>
                  <div className="mb-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {entry.email}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {entry.phone}
                    </span>
                  </div>
                  {(entry.profession || entry.wilaya) && (
                    <p className="text-xs text-slate-500">
                      {[entry.profession, entry.wilaya].filter(Boolean).join(" • ")}
                    </p>
                  )}
                  {entry.courseLabel && (
                    <p className="mt-1 text-xs font-medium text-dentova-navy">
                      {entry.courseLabel}
                    </p>
                  )}
                  {entry.message && (
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {entry.message}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <StatusBadge variant={entry.status === "new" ? "new" : "read"} />
                  {entry.createdAt && (
                    <span className="text-xs text-slate-400">
                      {new Date(entry.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short"
                      })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
