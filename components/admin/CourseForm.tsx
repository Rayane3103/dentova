"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { adminFormClassName, adminLabelClassName } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { siteConfig } from "@/lib/constants";
import { courseSchema } from "@/lib/validators/course";
import type { Category } from "@/types";

type CourseFormValues = z.infer<typeof courseSchema>;

type CourseFormProps = {
  courseId?: string;
  initialValues?: Partial<CourseFormValues>;
};

export function CourseForm({ courseId, initialValues }: CourseFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setValue,
    watch
  } = useForm<CourseFormValues>({
    defaultValues: {
      categoryId: initialValues?.categoryId || "",
      contactEmail: initialValues?.contactEmail || siteConfig.email,
      contactPhone: initialValues?.contactPhone || siteConfig.phone,
      date: initialValues?.date || new Date(),
      description: initialValues?.description || "",
      excerpt: initialValues?.excerpt || "",
      featured: initialValues?.featured ?? false,
      imagePublicId: initialValues?.imagePublicId,
      imageUrl: initialValues?.imageUrl || "",
      instructor: initialValues?.instructor || "",
      location: initialValues?.location || "Alger",
      maxSeats: initialValues?.maxSeats,
      price: initialValues?.price ?? 0,
      published: initialValues?.published ?? true,
      showOnHomepage: initialValues?.showOnHomepage ?? true,
      subtitle: initialValues?.subtitle || "",
      time: initialValues?.time || "10:00",
      title: initialValues?.title || ""
    },
    resolver: zodResolver(courseSchema)
  });

  const imageUrl = watch("imageUrl");
  const imagePublicId = watch("imagePublicId");

  useEffect(() => {
    void fetch("/api/admin/categories")
      .then((response) => response.json())
      .then((data: { categories: Category[] }) => setCategories(data.categories));
  }, []);

  const onSubmit = async (values: CourseFormValues) => {
    const response = await fetch(
      courseId ? `/api/admin/courses/${courseId}` : "/api/admin/courses",
      {
        method: courseId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      }
    );

    if (!response.ok) {
      toast.error("Enregistrement impossible.");
      return;
    }

    toast.success(courseId ? "Cours mis a jour." : "Cours cree.");
    router.push("/admin/courses");
    router.refresh();
  };

  return (
    <form className={adminFormClassName} onSubmit={handleSubmit(onSubmit)}>
      <label className="block">
        <span className={adminLabelClassName}>Titre *</span>
        <Input placeholder="Titre du cours" size="sm" {...register("title")} />
        {errors.title ? <p className="mt-1 text-xs font-medium text-red-600">{errors.title.message}</p> : null}
      </label>

      <label className="block">
        <span className={adminLabelClassName}>Sous-titre</span>
        <Input placeholder="Sous-titre" size="sm" {...register("subtitle")} />
      </label>

      <label className="block">
        <span className={adminLabelClassName}>Description *</span>
        <Textarea className="min-h-32" placeholder="Description complete" size="sm" {...register("description")} />
        {errors.description ? <p className="mt-1 text-sm text-red-600">{errors.description.message}</p> : null}
      </label>

      <label className="block">
        <span className={adminLabelClassName}>Extrait</span>
        <Textarea className="min-h-20" placeholder="Resume court pour la carte" size="sm" {...register("excerpt")} />
      </label>

      <div>
        <span className={adminLabelClassName}>Image *</span>
        <ImageUploadField
          onChange={(value) => {
            setValue("imageUrl", value.imageUrl, { shouldValidate: true });
            setValue("imagePublicId", value.imagePublicId);
          }}
          value={{ imagePublicId, imageUrl }}
        />
        {errors.imageUrl ? <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={adminLabelClassName}>Categorie *</span>
          <Select size="sm" {...register("categoryId")}>
            <option value="">Selectionner</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          {errors.categoryId ? <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p> : null}
        </label>
        <label className="block">
          <span className={adminLabelClassName}>Formateur *</span>
          <Input placeholder="Nom du formateur" size="sm" {...register("instructor")} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={adminLabelClassName}>Date *</span>
          <Input size="sm" type="date" {...register("date", { valueAsDate: true })} />
        </label>
        <label className="block">
          <span className={adminLabelClassName}>Heure</span>
          <Input size="sm" type="time" {...register("time")} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={adminLabelClassName}>Lieu *</span>
          <Input placeholder="Alger" size="sm" {...register("location")} />
        </label>
        <label className="block">
          <span className={adminLabelClassName}>Prix (DA) *</span>
          <Input min="0" size="sm" type="number" {...register("price", { valueAsNumber: true })} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={adminLabelClassName}>Telephone *</span>
          <Input size="sm" {...register("contactPhone")} />
        </label>
        <label className="block">
          <span className={adminLabelClassName}>Email *</span>
          <Input size="sm" type="email" {...register("contactEmail")} />
        </label>
      </div>

      <label className="block">
        <span className={adminLabelClassName}>Places max</span>
        <Input min="1" size="sm" type="number" {...register("maxSeats", { valueAsNumber: true })} />
      </label>

      <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.06em] text-slate-500">
          Visibilité
        </p>
        <div className="space-y-3">
          <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
            <Checkbox {...register("featured")} /> Cours en vedette
          </label>
          <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
            <Checkbox {...register("showOnHomepage")} /> Afficher sur l&apos;accueil
          </label>
          <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
            <Checkbox {...register("published")} /> Publié
          </label>
        </div>
      </div>

      <Button className="w-full" disabled={isSubmitting} size="sm" type="submit">
        {isSubmitting ? <Loader className="h-4 w-4 animate-spin" /> : null}
        {courseId ? "Mettre a jour" : "Creer le cours"}
      </Button>
    </form>
  );
}
