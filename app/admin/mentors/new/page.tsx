import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { MentorForm } from "@/components/admin/MentorForm";

export default function NewMentorPage() {
  return (
    <AdminShell>
      <AdminHeader title="Nouveau mentor" />
      <div className="mt-5">
        <MentorForm />
      </div>
    </AdminShell>
  );
}
