import { AdminHeader } from "@/components/admin/AdminHeader";
import { SignupsList } from "@/components/admin/SignupsList";
import { tryConnectToDatabase } from "@/lib/db/connect";
import { ClientSignup } from "@/models/ClientSignup";
import { Reservation } from "@/models/Reservation";

export default async function SignupsPage() {
  let entries: Parameters<typeof SignupsList>[0]["initialEntries"] = [];

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
        createdAt: signup.createdAt ? String(signup.createdAt) : undefined
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
          createdAt: reservation.createdAt ? String(reservation.createdAt) : undefined
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
      <SignupsList initialEntries={entries} />
    </>
  );
}
