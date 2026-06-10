import { AdminShell } from "@/components/admin/AdminShell";
import { CourseForm } from "@/components/admin/CourseForm";

export default function EditCoursePage() {
  return (
    <AdminShell>
      <h1 className="text-4xl font-extrabold text-dentova-navy">Edit Course</h1>
      <p className="mt-2 text-xl text-dentova-ink/60">
        Update course content, schedule, image, and visibility.
      </p>
      <div className="mt-8">
        <CourseForm />
      </div>
    </AdminShell>
  );
}
