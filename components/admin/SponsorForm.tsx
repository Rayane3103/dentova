"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { adminFormClassName, adminLabelClassName } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { sponsorSchema } from "@/lib/validators/sponsor";

type SponsorValues = z.infer<typeof sponsorSchema>;

export function SponsorForm({
  initialValues,
  sponsorId
}: {
  initialValues?: Partial<SponsorValues>;
  sponsorId?: string;
}) {
  const router = useRouter();
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setValue,
    watch
  } = useForm<SponsorValues>({
    defaultValues: {
      active: initialValues?.active ?? true,
      imagePublicId: initialValues?.imagePublicId,
      imageUrl: initialValues?.imageUrl || "",
      name: initialValues?.name || "",
      order: initialValues?.order ?? 0,
      websiteUrl: initialValues?.websiteUrl || ""
    },
    resolver: zodResolver(sponsorSchema)
  });

  const imageUrl = watch("imageUrl");
  const imagePublicId = watch("imagePublicId");

  const onSubmit = async (values: SponsorValues) => {
    const response = await fetch(
      sponsorId ? `/api/admin/sponsors/${sponsorId}` : "/api/admin/sponsors",
      {
        method: sponsorId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      }
    );

    if (!response.ok) {
      toast.error("Enregistrement impossible.");
      return;
    }

    toast.success(sponsorId ? "Sponsor mis a jour." : "Sponsor ajoute.");
    router.push("/admin/sponsors");
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
        <span className={adminLabelClassName}>Site web</span>
        <Input placeholder="https://..." size="sm" type="url" {...register("websiteUrl")} />
        {errors.websiteUrl ? (
          <p className="mt-1 text-xs text-red-600">{errors.websiteUrl.message}</p>
        ) : null}
      </label>
      <div>
        <span className={adminLabelClassName}>Logo *</span>
        <ImageUploadField
          onChange={(value) => {
            setValue("imageUrl", value.imageUrl, { shouldValidate: true });
            setValue("imagePublicId", value.imagePublicId);
          }}
          value={{ imagePublicId, imageUrl }}
        />
        {errors.imageUrl ? (
          <p className="mt-1 text-xs text-red-600">{errors.imageUrl.message}</p>
        ) : null}
      </div>
      <label className="block">
        <span className={adminLabelClassName}>Ordre</span>
        <Input size="sm" type="number" {...register("order", { valueAsNumber: true })} />
      </label>
      <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
        <Checkbox {...register("active")} /> Actif
      </label>
      <Button className="w-full" disabled={isSubmitting} size="sm" type="submit">
        {isSubmitting ? <Loader className="h-4 w-4 animate-spin" /> : null}
        {sponsorId ? "Mettre a jour" : "Ajouter le sponsor"}
      </Button>
    </form>
  );
}
