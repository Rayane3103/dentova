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
import { Textarea } from "@/components/ui/Textarea";
import { mentorSchema } from "@/lib/validators/content";

type MentorFormValues = z.infer<typeof mentorSchema>;

export function MentorForm({
  initialValues,
  mentorId
}: {
  initialValues?: Partial<MentorFormValues>;
  mentorId?: string;
}) {
  const router = useRouter();
  const {
    formState: { isSubmitting },
    handleSubmit,
    register,
    setValue,
    watch
  } = useForm<MentorFormValues>({
    defaultValues: {
      active: initialValues?.active ?? true,
      bio: initialValues?.bio || "",
      imagePublicId: initialValues?.imagePublicId,
      imageUrl: initialValues?.imageUrl || "",
      name: initialValues?.name || "",
      order: initialValues?.order ?? 0,
      showOnHomepage: initialValues?.showOnHomepage ?? true,
      specialty: initialValues?.specialty || "",
      title: initialValues?.title || ""
    },
    resolver: zodResolver(mentorSchema)
  });

  const imageUrl = watch("imageUrl");
  const imagePublicId = watch("imagePublicId");

  const onSubmit = async (values: MentorFormValues) => {
    const response = await fetch(
      mentorId ? `/api/admin/mentors/${mentorId}` : "/api/admin/mentors",
      {
        method: mentorId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      }
    );

    if (!response.ok) {
      toast.error("Enregistrement impossible.");
      return;
    }

    toast.success(mentorId ? "Mentor mis a jour." : "Mentor ajoute.");
    router.push("/admin/mentors");
    router.refresh();
  };

  return (
    <form className={adminFormClassName} onSubmit={handleSubmit(onSubmit)}>
      <label className="block">
        <span className={adminLabelClassName}>Nom *</span>
        <Input size="sm" {...register("name")} />
      </label>
      <label className="block">
        <span className={adminLabelClassName}>Titre *</span>
        <Input size="sm" {...register("title")} />
      </label>
      <label className="block">
        <span className={adminLabelClassName}>Specialite</span>
        <Input size="sm" {...register("specialty")} />
      </label>
      <label className="block">
        <span className={adminLabelClassName}>Bio</span>
        <Textarea size="sm" {...register("bio")} />
      </label>
      <div>
        <span className={adminLabelClassName}>Photo *</span>
        <ImageUploadField
          onChange={(value) => {
            setValue("imageUrl", value.imageUrl, { shouldValidate: true });
            setValue("imagePublicId", value.imagePublicId);
          }}
          value={{ imagePublicId, imageUrl }}
        />
      </div>
      <label className="block">
        <span className={adminLabelClassName}>Ordre</span>
        <Input size="sm" type="number" {...register("order", { valueAsNumber: true })} />
      </label>
      <label className="flex items-center gap-2 text-sm font-medium text-dentova-ink">
        <Checkbox {...register("active")} /> Actif
      </label>
      <label className="flex items-center gap-2 text-sm font-medium text-dentova-ink">
        <Checkbox {...register("showOnHomepage")} /> Afficher sur l&apos;accueil
      </label>
      <Button className="w-full" disabled={isSubmitting} size="sm" type="submit">
        {isSubmitting ? <Loader className="h-4 w-4 animate-spin" /> : null}
        {mentorId ? "Mettre a jour" : "Ajouter le mentor"}
      </Button>
    </form>
  );
}
