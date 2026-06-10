"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
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
    <form className="max-w-2xl space-y-5 rounded-xl border border-dentova-navy/10 bg-white p-6 shadow-card" onSubmit={handleSubmit(onSubmit)}>
      <label className="block">
        <span className="mb-2 block font-bold text-dentova-navy">Question *</span>
        <Input {...register("question")} />
        {errors.question ? <p className="mt-1 text-sm text-dentova-magenta">{errors.question.message}</p> : null}
      </label>
      <label className="block">
        <span className="mb-2 block font-bold text-dentova-navy">Reponse *</span>
        <Textarea className="min-h-32" {...register("answer")} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block font-bold text-dentova-navy">Categorie</span>
          <Select {...register("category")}>
            <option value="General">General</option>
            <option value="Formations">Formations</option>
            <option value="Certification">Certification</option>
            <option value="Paiement">Paiement</option>
          </Select>
        </label>
        <label className="block">
          <span className="mb-2 block font-bold text-dentova-navy">Ordre</span>
          <Input type="number" {...register("sortOrder", { valueAsNumber: true })} />
        </label>
      </div>
      <label className="flex items-center gap-2 font-semibold text-dentova-ink">
        <Checkbox {...register("published")} /> Publiee
      </label>
      <Button className="w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? <Loader className="h-4 w-4 animate-spin" /> : null}
        {faqId ? "Mettre a jour" : "Creer la FAQ"}
      </Button>
    </form>
  );
}
