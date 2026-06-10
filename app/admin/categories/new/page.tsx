import { CategoryForm } from "@/components/admin/CategoryForm";
import { AdminShell } from "@/components/admin/AdminShell";

export default function NewCategoryPage() {
  return (
    <AdminShell>
      <h1 className="text-4xl font-extrabold text-dentova-navy">
        Create New Category
      </h1>
      <p className="mt-2 text-xl text-dentova-ink/60">
        Add a category for filtering public courses.
      </p>
      <div className="mt-8">
        <CategoryForm />
      </div>
    </AdminShell>
  );
}
