import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminTable } from "@/components/admin/AdminTable";
import { Button } from "@/components/ui/Button";
import { getAllCourses } from "@/lib/data/queries";

export default async function AdminCoursesPage() {
  const courses = await getAllCourses();

  return (
    <AdminShell>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <AdminHeader title="Gestion des cours" />
        <Button asChild href="/admin/courses/new">
          Nouveau cours
        </Button>
      </div>
      <AdminTable courses={courses} />
    </AdminShell>
  );
}
