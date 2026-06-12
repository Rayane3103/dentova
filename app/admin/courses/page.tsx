import { Plus } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CoursesTable } from "@/components/admin/CoursesTableClient";
import { Button } from "@/components/ui/Button";
import { getAllCourses } from "@/lib/data/queries";

export default async function AdminCoursesPage() {
  const courses = await getAllCourses();

  return (
    <>
      <AdminHeader
        actions={
          <Button asChild href="/admin/courses/new" size="sm">
            <Plus className="h-3.5 w-3.5" />
            Nouvelle formation
          </Button>
        }
        description="Gérez le catalogue de formations, les dates et la publication"
        title="Formations"
      />
      <CoursesTable courses={courses} />
    </>
  );
}
