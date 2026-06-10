"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
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
    <form className="max-w-2xl space-y-5 rounded-xl border border-dentova-navy/10 bg-white p-6 shadow-card" onSubmit={handleSubmit(onSubmit)}>
      <label className="block">
        <span className="mb-2 block font-bold text-dentova-navy">Titre *</span>
        <Input placeholder="Titre du cours" {...register("title")} />
        {errors.title ? <p className="mt-1 text-sm text-dentova-magenta">{errors.title.message}</p> : null}
      </label>

      <label className="block">
        <span className="mb-2 block font-bold text-dentova-navy">Sous-titre</span>
        <Input placeholder="Sous-titre" {...register("subtitle")} />
      </label>

      <label className="block">
        <span className="mb-2 block font-bold text-dentova-navy">Description *</span>
        <Textarea className="min-h-40" placeholder="Description complete" {...register("description")} />
        {errors.description ? <p className="mt-1 text-sm text-dentova-magenta">{errors.description.message}</p> : null}
      </label>

      <label className="block">
        <span className="mb-2 block font-bold text-dentova-navy">Extrait</span>
        <Textarea className="min-h-24" placeholder="Resume court pour la carte" {...register("excerpt")} />
      </label>

      <div>
        <span className="mb-2 block font-bold text-dentova-navy">Image *</span>
        <ImageUploadField
          onChange={(value) => {
            setValue("imageUrl", value.imageUrl, { shouldValidate: true });
            setValue("imagePublicId", value.imagePublicId);
          }}
          value={{ imagePublicId, imageUrl }}
        />
        {errors.imageUrl ? <p className="mt-1 text-sm text-dentova-magenta">{errors.imageUrl.message}</p> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block font-bold text-dentova-navy">Categorie *</span>
          <Select {...register("categoryId")}>
            <option value="">Selectionner</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          {errors.categoryId ? <p className="mt-1 text-sm text-dentova-magenta">{errors.categoryId.message}</p> : null}
        </label>
        <label className="block">
          <span className="mb-2 block font-bold text-dentova-navy">Formateur *</span>
          <Input placeholder="Nom du formateur" {...register("instructor")} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block font-bold text-dentova-navy">Date *</span>
          <Input type="date" {...register("date", { valueAsDate: true })} />
        </label>
        <label className="block">
          <span className="mb-2 block font-bold text-dentova-navy">Heure</span>
          <Input type="time" {...register("time")} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block font-bold text-dentova-navy">Lieu *</span>
          <Input placeholder="Alger" {...register("location")} />
        </label>
        <label className="block">
          <span className="mb-2 block font-bold text-dentova-navy">Prix (DA) *</span>
          <Input min="0" type="number" {...register("price", { valueAsNumber: true })} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block font-bold text-dentova-navy">Telephone *</span>
          <Input {...register("contactPhone")} />
        </label>
        <label className="block">
          <span className="mb-2 block font-bold text-dentova-navy">Email *</span>
          <Input type="email" {...register("contactEmail")} />
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block font-bold text-dentova-navy">Places max</span>
        <Input min="1" type="number" {...register("maxSeats", { valueAsNumber: true })} />
      </label>

      <div className="space-y-3">
        <label className="flex items-center gap-2 font-semibold text-dentova-ink">
          <Checkbox {...register("featured")} /> Cours en vedette
        </label>
        <label className="flex items-center gap-2 font-semibold text-dentova-ink">
          <Checkbox {...register("showOnHomepage")} /> Afficher sur l&apos;accueil
        </label>
        <label className="flex items-center gap-2 font-semibold text-dentova-ink">
          <Checkbox {...register("published")} /> Publie
        </label>
      </div>

      <Button className="w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? <Loader className="h-4 w-4 animate-spin" /> : null}
        {courseId ? "Mettre a jour" : "Creer le cours"}
      </Button>
    </form>
  );
}
