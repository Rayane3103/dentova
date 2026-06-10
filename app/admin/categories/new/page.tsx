import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { CategoryForm } from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
  return (
    <AdminShell>
      <AdminHeader title="Nouvelle categorie" />
      <div className="mt-5">
        <CategoryForm />
      </div>
    </AdminShell>
  );
}
