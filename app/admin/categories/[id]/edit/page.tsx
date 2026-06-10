import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { getCategoryById } from "@/lib/data/queries";

type EditCategoryPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;
  const category = await getCategoryById(id);

  if (!category) {
    notFound();
  }

  return (
    <AdminShell>
      <AdminHeader title="Modifier la categorie" />
      <div className="mt-5">
        <CategoryForm
          categoryId={id}
          initialValues={{
            description: category.description,
            name: category.name,
            sortOrder: category.sortOrder
          }}
        />
      </div>
    </AdminShell>
  );
}
