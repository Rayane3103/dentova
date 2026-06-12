import { AdminHeader } from "@/components/admin/AdminHeader";
import { MentorForm } from "@/components/admin/MentorForm";

export default function NewMentorPage() {
  return (
    <>
      <AdminHeader title="Nouveau formateur" />
      <div className="mt-5">
        <MentorForm />
      </div>
    </>
  );
}
