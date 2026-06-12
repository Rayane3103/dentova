import { FolderTree, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/Button";
import { getCategories } from "@/lib/data/queries";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <>
      <AdminHeader
        actions={
          <Button asChild href="/admin/categories/new" size="sm">
            <Plus className="h-3.5 w-3.5" />
            Nouvelle catégorie
          </Button>
        }
        description="Organisez vos formations par catégories"
        title="Catégories"
      />
      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <FolderTree className="h-7 w-7 text-slate-400" />
          </div>
          <h3 className="mt-5 text-base font-bold text-slate-800">
            Aucune catégorie
          </h3>
          <p className="mt-1.5 text-sm text-slate-500">
            Créez des catégories pour organiser vos formations.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="divide-y divide-slate-50">
            {categories.map((category) => (
              <div
                className="flex flex-col gap-3 px-5 py-4 transition hover:bg-slate-50/70 sm:flex-row sm:items-center sm:justify-between"
                key={category.id}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-dentova-navy/8">
                      <FolderTree className="h-4 w-4 text-dentova-navy" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {category.name}
                      </p>
                      {category.description && (
                        <p className="mt-0.5 text-xs text-slate-400">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link
                    className="dentova-focus inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                    href={`/admin/categories/${category.id}/edit`}
                  >
                    <Pencil className="mr-1.5 h-3.5 w-3.5" />
                    Modifier
                  </Link>
                  <AdminDeleteButton endpoint={`/api/admin/categories/${category.id}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
