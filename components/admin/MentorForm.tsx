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
    <form className="max-w-xl space-y-5 rounded-xl border border-dentova-navy/10 bg-white p-6 shadow-card" onSubmit={handleSubmit(onSubmit)}>
      <label className="block">
        <span className="mb-2 block font-bold text-dentova-navy">Nom *</span>
        <Input {...register("name")} />
      </label>
      <label className="block">
        <span className="mb-2 block font-bold text-dentova-navy">Titre *</span>
        <Input {...register("title")} />
      </label>
      <label className="block">
        <span className="mb-2 block font-bold text-dentova-navy">Specialite</span>
        <Input {...register("specialty")} />
      </label>
      <label className="block">
        <span className="mb-2 block font-bold text-dentova-navy">Bio</span>
        <Textarea {...register("bio")} />
      </label>
      <div>
        <span className="mb-2 block font-bold text-dentova-navy">Photo *</span>
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
        <Checkbox {...register("active")} /> Actif
      </label>
      <label className="flex items-center gap-2 font-semibold text-dentova-ink">
        <Checkbox {...register("showOnHomepage")} /> Afficher sur l&apos;accueil
      </label>
      <Button className="w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? <Loader className="h-4 w-4 animate-spin" /> : null}
        {mentorId ? "Mettre a jour" : "Ajouter le mentor"}
      </Button>
    </form>
  );
}
