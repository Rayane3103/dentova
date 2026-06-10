import { Plus } from "lucide-react";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminCardClassName } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getCategories } from "@/lib/data/queries";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <AdminShell>
      <AdminHeader
        actions={
          <Button asChild href="/admin/categories/new" size="sm">
            <Plus className="h-3.5 w-3.5" />
            Nouvelle categorie
          </Button>
        }
        title="Categories"
      />
      <Card className={`${adminCardClassName} mt-5 overflow-hidden p-0`}>
        {categories.length === 0 ? (
          <p className="px-4 py-6 text-sm text-dentova-muted">Aucune categorie creee.</p>
        ) : (
          <div className="divide-y divide-dentova-navy/8">
            {categories.map((category) => (
              <div
                className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                key={category.id}
              >
                <div className="min-w-0">
                  <p className="font-semibold text-dentova-navy">{category.name}</p>
                  {category.description ? (
                    <p className="mt-0.5 text-sm text-dentova-muted">{category.description}</p>
                  ) : null}
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    asChild
                    href={`/admin/categories/${category.id}/edit`}
                    size="sm"
                    variant="outline"
                  >
                    Modifier
                  </Button>
                  <AdminDeleteButton endpoint={`/api/admin/categories/${category.id}`} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </AdminShell>
  );
}
