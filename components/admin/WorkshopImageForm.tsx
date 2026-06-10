"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { workshopImageSchema } from "@/lib/validators/workshop-image";

type WorkshopImageValues = z.infer<typeof workshopImageSchema>;

export function WorkshopImageForm({
  imageId,
  initialValues
}: {
  imageId?: string;
  initialValues?: Partial<WorkshopImageValues>;
}) {
  const router = useRouter();
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setValue,
    watch
  } = useForm<WorkshopImageValues>({
    defaultValues: {
      active: initialValues?.active ?? true,
      description: initialValues?.description || "",
      imagePublicId: initialValues?.imagePublicId,
      imageUrl: initialValues?.imageUrl || "",
      order: initialValues?.order ?? 0,
      title: initialValues?.title || ""
    },
    resolver: zodResolver(workshopImageSchema)
  });

  const imageUrl = watch("imageUrl");
  const imagePublicId = watch("imagePublicId");

  const onSubmit = async (values: WorkshopImageValues) => {
    const response = await fetch(
      imageId ? `/api/admin/workshop-images/${imageId}` : "/api/admin/workshop-images",
      {
        method: imageId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      }
    );

    if (!response.ok) {
      toast.error("Enregistrement impossible.");
      return;
    }

    toast.success(imageId ? "Image mise a jour." : "Image ajoutee.");
    router.push("/admin/workshop-images");
    router.refresh();
  };

  return (
    <form className="max-w-xl space-y-5 rounded-xl border border-dentova-navy/10 bg-white p-6 shadow-card" onSubmit={handleSubmit(onSubmit)}>
      <label className="block">
        <span className="mb-2 block font-bold text-dentova-navy">Titre *</span>
        <Input {...register("title")} />
        {errors.title ? <p className="mt-1 text-sm text-dentova-magenta">{errors.title.message}</p> : null}
      </label>
      <label className="block">
        <span className="mb-2 block font-bold text-dentova-navy">Description</span>
        <Textarea {...register("description")} />
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
      </div>
      <label className="block">
        <span className="mb-2 block font-bold text-dentova-navy">Ordre</span>
        <Input type="number" {...register("order", { valueAsNumber: true })} />
      </label>
      <label className="flex items-center gap-2 font-semibold text-dentova-ink">
        <Checkbox {...register("active")} /> Active
      </label>
      <Button className="w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? <Loader className="h-4 w-4 animate-spin" /> : null}
        {imageId ? "Mettre a jour" : "Ajouter l'image"}
      </Button>
    </form>
  );
}
