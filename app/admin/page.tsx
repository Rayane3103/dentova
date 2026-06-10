import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminTable } from "@/components/admin/AdminTable";
import { adminCardClassName } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getAdminStats, getAllCourses } from "@/lib/data/queries";

export default async function AdminDashboardPage() {
  const [stats, courses] = await Promise.all([getAdminStats(), getAllCourses()]);

  return (
    <AdminShell>
      <AdminHeader title="Tableau de bord" />

      {stats ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard href="/admin/courses" label="Cours" value={stats.courses} />
          <AdminStatCard
            href="/admin/feedback"
            label="Avis en attente"
            value={stats.pendingFeedback}
          />
          <AdminStatCard href="/admin/messages" label="Messages" value={stats.newMessages} />
          <AdminStatCard
            href="/admin/signups"
            label="Inscriptions"
            value={stats.signups + stats.reservations}
          />
        </div>
      ) : (
        <Card className={`${adminCardClassName} mt-5 p-5 text-sm text-dentova-muted`}>
          Configurez <code>MONGODB_URI</code> sur Vercel pour activer le tableau de bord.
        </Card>
      )}

      <div className="mt-6 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-dentova-navy">Cours recents</h2>
        <Button asChild href="/admin/courses/new" size="sm">
          <Plus className="h-3.5 w-3.5" />
          Nouveau cours
        </Button>
      </div>
      <AdminTable compact courses={courses.slice(0, 5)} />
    </AdminShell>
  );
}
