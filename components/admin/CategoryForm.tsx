"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { adminFormClassName, adminLabelClassName } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { categorySchema } from "@/lib/validators/category";

type CategoryFormValues = z.infer<typeof categorySchema>;

export function CategoryForm({
  categoryId,
  initialValues
}: {
  categoryId?: string;
  initialValues?: Partial<CategoryFormValues>;
}) {
  const router = useRouter();
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register
  } = useForm<CategoryFormValues>({
    defaultValues: {
      description: initialValues?.description || "",
      name: initialValues?.name || "",
      sortOrder: initialValues?.sortOrder ?? 0
    },
    resolver: zodResolver(categorySchema)
  });

  const onSubmit = async (values: CategoryFormValues) => {
    const response = await fetch(
      categoryId ? `/api/admin/categories/${categoryId}` : "/api/admin/categories",
      {
        method: categoryId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      }
    );

    if (!response.ok) {
      toast.error("Enregistrement impossible.");
      return;
    }

    toast.success(categoryId ? "Categorie mise a jour." : "Categorie creee.");
    router.push("/admin/categories");
    router.refresh();
  };

  return (
    <form className={adminFormClassName} onSubmit={handleSubmit(onSubmit)}>
      <label className="block">
        <span className={adminLabelClassName}>Nom *</span>
        <Input size="sm" {...register("name")} />
        {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name.message}</p> : null}
      </label>
      <label className="block">
        <span className={adminLabelClassName}>Description</span>
        <Textarea size="sm" {...register("description")} />
      </label>
      <label className="block">
        <span className={adminLabelClassName}>Ordre</span>
        <Input size="sm" type="number" {...register("sortOrder", { valueAsNumber: true })} />
      </label>
      <Button className="w-full" disabled={isSubmitting} size="sm" type="submit">
        {isSubmitting ? <Loader className="h-4 w-4 animate-spin" /> : null}
        {categoryId ? "Mettre a jour" : "Creer la categorie"}
      </Button>
    </form>
  );
}
