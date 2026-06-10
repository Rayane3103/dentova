import { AdminShell } from "@/components/admin/AdminShell";
import { MentorForm } from "@/components/admin/MentorForm";

export default function NewMentorPage() {
  return (
    <AdminShell>
      <h1 className="text-4xl font-extrabold text-dentova-navy">Nouveau mentor</h1>
      <div className="mt-8">
        <MentorForm />
      </div>
    </AdminShell>
  );
}
