import { AdminShell } from "@/components/admin/AdminShell";
import { FAQForm } from "@/components/admin/FAQForm";

export default function NewFaqPage() {
  return (
    <AdminShell>
      <h1 className="text-4xl font-extrabold text-dentova-navy">Nouvelle FAQ</h1>
      <div className="mt-8">
        <FAQForm />
      </div>
    </AdminShell>
  );
}
