import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminBadgeClassName, adminCardClassName } from "@/components/admin/admin-ui";
import { Card } from "@/components/ui/Card";
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
          courseLabel: course?.title ? String(course.title) : "Formation non renseignee",
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
    <AdminShell>
      <AdminHeader
        description="Demandes generales et reservations de cours soumises depuis le site public."
        title="Inscriptions clients"
      />
      <div className="mt-5 space-y-3">
        {entries.length === 0 ? (
          <Card className={`${adminCardClassName} p-5 text-sm text-dentova-muted`}>
            Aucune inscription recue.
          </Card>
        ) : (
          entries.map((entry) => (
            <Card className={`${adminCardClassName} p-4`} key={`${entry.kind}-${entry.id}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="mb-2">
                    <span className={adminBadgeClassName}>
                      {entry.kind === "course" ? "Reservation cours" : "Inscription generale"}
                    </span>
                  </div>
                  <p className="font-semibold text-dentova-navy">{entry.fullName}</p>
                  <p className="text-xs text-dentova-muted">
                    {entry.email} • {entry.phone}
                  </p>
                  {entry.profession || entry.wilaya ? (
                    <p className="mt-1.5 text-sm text-dentova-ink">
                      {[entry.profession, entry.wilaya].filter(Boolean).join(" • ")}
                    </p>
                  ) : null}
                  {entry.courseLabel ? (
                    <p className="text-sm text-dentova-muted">Formation: {entry.courseLabel}</p>
                  ) : null}
                  {entry.message ? (
                    <p className="mt-2 text-sm leading-relaxed text-dentova-ink">{entry.message}</p>
                  ) : null}
                </div>
                <span className={adminBadgeClassName}>{entry.status}</span>
              </div>
            </Card>
          ))
        )}
      </div>
    </AdminShell>
  );
}
