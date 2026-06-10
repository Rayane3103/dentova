import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminTable } from "@/components/admin/AdminTable";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getAdminStats, getAllCourses } from "@/lib/data/queries";

export default async function AdminDashboardPage() {
  const [stats, courses] = await Promise.all([getAdminStats(), getAllCourses()]);

  return (
    <AdminShell>
      <AdminHeader title="Tableau de bord" />
      {stats ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Cours", value: stats.courses, href: "/admin/courses" },
            { label: "Avis en attente", value: stats.pendingFeedback, href: "/admin/feedback" },
            { label: "Messages", value: stats.newMessages, href: "/admin/messages" },
            { label: "Inscriptions", value: stats.signups, href: "/admin/signups" }
          ].map((item) => (
            <Link href={item.href} key={item.label}>
              <Card className="p-5 transition hover:border-dentova-teal/40">
                <p className="text-sm font-semibold text-dentova-muted">{item.label}</p>
                <p className="mt-2 text-3xl font-extrabold text-dentova-navy">{item.value}</p>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="mt-6 p-6 text-dentova-muted">
          Configurez <code>MONGODB_URI</code> sur Vercel pour activer le tableau de bord.
        </Card>
      )}

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-dentova-navy">Cours recents</h2>
        <Button asChild href="/admin/courses/new">
          Nouveau cours
        </Button>
      </div>
      <AdminTable courses={courses.slice(0, 5)} compact />
    </AdminShell>
  );
}
