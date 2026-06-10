import { AdminShell } from "@/components/admin/AdminShell";
import { CourseForm } from "@/components/admin/CourseForm";

export default function NewCoursePage() {
  return (
    <AdminShell>
      <h1 className="text-4xl font-extrabold text-dentova-navy">
        Create New Course
      </h1>
      <p className="mt-2 text-xl text-dentova-ink/60">
        Add a new course to your platform
      </p>
      <div className="mt-8">
        <CourseForm />
      </div>
    </AdminShell>
  );
}
