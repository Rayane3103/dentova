import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/Card";
import { placeholderCategories } from "@/lib/constants";

export default function CategoriesPage() {
  return (
    <AdminShell>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-4xl font-extrabold text-dentova-navy">
          Categories
        </h1>
        <Link
          className="rounded-lg bg-dentova-magenta px-5 py-2 font-bold text-white"
          href="/admin/categories/new"
        >
          Add New Category
        </Link>
      </div>
      <Card className="mt-8 overflow-hidden rounded-xl p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-dentova-navy/10">
              <th className="py-3">Name</th>
              <th className="py-3">Slug</th>
              <th className="py-3">Sort</th>
            </tr>
          </thead>
          <tbody>
            {placeholderCategories.map((category) => (
              <tr
                className="border-b border-dentova-navy/10 last:border-0"
                key={category.id}
              >
                <td className="py-3 font-bold text-dentova-navy">
                  {category.name}
                </td>
                <td className="py-3 text-dentova-ink/70">{category.slug}</td>
                <td className="py-3 text-dentova-ink/70">
                  {category.sortOrder}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </AdminShell>
  );
}
