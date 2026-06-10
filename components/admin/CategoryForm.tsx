"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
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
    <form className="max-w-xl space-y-5 rounded-xl border border-dentova-navy/10 bg-white p-6 shadow-card" onSubmit={handleSubmit(onSubmit)}>
      <label className="block">
        <span className="mb-2 block font-bold text-dentova-navy">Nom *</span>
        <Input {...register("name")} />
        {errors.name ? <p className="mt-1 text-sm text-dentova-magenta">{errors.name.message}</p> : null}
      </label>
      <label className="block">
        <span className="mb-2 block font-bold text-dentova-navy">Description</span>
        <Textarea {...register("description")} />
      </label>
      <label className="block">
        <span className="mb-2 block font-bold text-dentova-navy">Ordre</span>
        <Input type="number" {...register("sortOrder", { valueAsNumber: true })} />
      </label>
      <Button className="w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? <Loader className="h-4 w-4 animate-spin" /> : null}
        {categoryId ? "Mettre a jour" : "Creer la categorie"}
      </Button>
    </form>
  );
}
