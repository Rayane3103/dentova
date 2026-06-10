import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function AdminHeader({
  description,
  title
}: {
  description?: string;
  title: string;
}) {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-4xl font-extrabold text-dentova-navy">{title}</h1>
        {description ? (
          <p className="mt-2 text-xl text-dentova-ink/60">{description}</p>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-3">
        <Button asChild href="/admin/categories/new" size="sm">
          <Plus className="h-4 w-4" />
          Add New Category
        </Button>
        <Button asChild href="/admin/courses/new" size="sm">
          <Plus className="h-4 w-4" />
          Add New Course
        </Button>
        <Button asChild href="/admin/workshop-images/new" size="sm">
          <Plus className="h-4 w-4" />
          Add Workshop Images
        </Button>
      </div>
    </div>
  );
}
