import { Plus } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminTable } from "@/components/admin/AdminTable";
import { Button } from "@/components/ui/Button";
import { getAllCourses } from "@/lib/data/queries";

export default async function AdminCoursesPage() {
  const courses = await getAllCourses();

  return (
    <AdminShell>
      <AdminHeader
        actions={
          <Button asChild href="/admin/courses/new" size="sm">
            <Plus className="h-3.5 w-3.5" />
            Nouveau cours
          </Button>
        }
        description="Gerez le catalogue public, les dates et la publication des formations."
        title="Gestion des cours"
      />
      <AdminTable courses={courses} />
    </AdminShell>
  );
}
