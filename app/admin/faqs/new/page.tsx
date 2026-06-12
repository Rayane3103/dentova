import { AdminHeader } from "@/components/admin/AdminHeader";
import { FAQForm } from "@/components/admin/FAQForm";

export default function NewFaqPage() {
  return (
    <>
      <AdminHeader title="Nouvelle FAQ" />
      <div className="mt-5">
        <FAQForm />
      </div>
    </>
  );
}
