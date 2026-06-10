import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminTable } from "@/components/admin/AdminTable";
import { placeholderCourses } from "@/lib/constants";

export default function AdminDashboardPage() {
  return (
    <AdminShell>
      <AdminHeader title="Manage Courses" />
      <AdminTable courses={placeholderCourses} />
    </AdminShell>
  );
}
