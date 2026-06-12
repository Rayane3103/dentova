import { AdminHeader } from "@/components/admin/AdminHeader";
import { CategoryForm } from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
  return (
    <>
      <AdminHeader title="Nouvelle catégorie" />
      <div className="mt-5">
        <CategoryForm />
      </div>
    </>
  );
}
