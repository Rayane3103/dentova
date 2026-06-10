import { notFound } from "next/navigation";
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
      <h1 className="text-4xl font-extrabold text-dentova-navy">Modifier la categorie</h1>
      <div className="mt-8">
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
