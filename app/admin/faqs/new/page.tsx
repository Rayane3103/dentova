import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { FAQForm } from "@/components/admin/FAQForm";

export default function NewFaqPage() {
  return (
    <AdminShell>
      <AdminHeader title="Nouvelle FAQ" />
      <div className="mt-5">
        <FAQForm />
      </div>
    </AdminShell>
  );
}
