import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getCategories } from "@/lib/data/queries";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <AdminShell>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <AdminHeader title="Categories" />
        <Button asChild href="/admin/categories/new">
          Nouvelle categorie
        </Button>
      </div>
      <Card className="mt-8 overflow-hidden rounded-xl p-6">
        {categories.length === 0 ? (
          <p className="text-dentova-muted">Aucune categorie creee.</p>
        ) : (
          <div className="space-y-3">
            {categories.map((category) => (
              <div
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dentova-navy/10 p-4"
                key={category.id}
              >
                <div>
                  <p className="font-bold text-dentova-navy">{category.name}</p>
                  <p className="text-sm text-dentova-muted">{category.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button asChild href={`/admin/categories/${category.id}/edit`} size="sm" variant="outline">
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
