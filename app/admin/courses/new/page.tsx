import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { CourseForm } from "@/components/admin/CourseForm";

export default function NewCoursePage() {
  return (
    <AdminShell>
      <AdminHeader
        description="Ajoutez une nouvelle formation au catalogue public."
        title="Nouveau cours"
      />
      <div className="mt-5">
        <CourseForm />
      </div>
    </AdminShell>
  );
}
