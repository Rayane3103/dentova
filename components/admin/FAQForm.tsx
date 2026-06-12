"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { adminFormClassName, adminLabelClassName } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { faqSchema } from "@/lib/validators/content";

type FAQFormValues = z.infer<typeof faqSchema>;

export function FAQForm({
  faqId,
  initialValues
}: {
  faqId?: string;
  initialValues?: Partial<FAQFormValues>;
}) {
  const router = useRouter();
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register
  } = useForm<FAQFormValues>({
    defaultValues: {
      answer: initialValues?.answer || "",
      category: initialValues?.category || "General",
      published: initialValues?.published ?? true,
      question: initialValues?.question || "",
      sortOrder: initialValues?.sortOrder ?? 0
    },
    resolver: zodResolver(faqSchema)
  });

  const onSubmit = async (values: FAQFormValues) => {
    const response = await fetch(
      faqId ? `/api/admin/faqs/${faqId}` : "/api/admin/faqs",
      {
        method: faqId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      }
    );

    if (!response.ok) {
      toast.error("Enregistrement impossible.");
      return;
    }

    toast.success(faqId ? "FAQ mise a jour." : "FAQ creee.");
    router.push("/admin/faqs");
    router.refresh();
  };

  return (
    <form className={adminFormClassName} onSubmit={handleSubmit(onSubmit)}>
      <label className="block">
        <span className={adminLabelClassName}>Question *</span>
        <Input size="sm" {...register("question")} />
        {errors.question ? <p className="mt-1 text-xs text-red-600">{errors.question.message}</p> : null}
      </label>
      <label className="block">
        <span className={adminLabelClassName}>Reponse *</span>
        <Textarea className="min-h-28" size="sm" {...register("answer")} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={adminLabelClassName}>Categorie</span>
          <Select size="sm" {...register("category")}>
            <option value="General">General</option>
            <option value="Formations">Formations</option>
            <option value="Certification">Certification</option>
            <option value="Paiement">Paiement</option>
          </Select>
        </label>
        <label className="block">
          <span className={adminLabelClassName}>Ordre</span>
          <Input size="sm" type="number" {...register("sortOrder", { valueAsNumber: true })} />
        </label>
      </div>
      <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
        <Checkbox {...register("published")} /> Publiée
      </label>
      <Button className="w-full" disabled={isSubmitting} size="sm" type="submit">
        {isSubmitting ? <Loader className="h-4 w-4 animate-spin" /> : null}
        {faqId ? "Mettre a jour" : "Creer la FAQ"}
      </Button>
    </form>
  );
}
