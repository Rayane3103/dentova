"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { type FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { CourseQuestionsBuilder } from "@/components/admin/CourseQuestionsBuilder";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { adminFormClassName, adminLabelClassName } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { siteConfig } from "@/lib/constants";
import { courseSchema } from "@/lib/validators/course";
import type { Category, CourseQuestion, Mentor } from "@/types";

type CourseFormValues = z.infer<typeof courseSchema>;

type CourseFormProps = {
  courseId?: string;
  initialValues?: Partial<CourseFormValues>;
};

function toDateInputValue(value: unknown) {
  if (!value) {
    return new Date().toISOString().slice(0, 10);
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return String(value).slice(0, 10);
}

function toDateInputValues(value: unknown, fallbackDate: unknown) {
  if (Array.isArray(value) && value.length > 0) {
    return value.map((date) => toDateInputValue(date));
  }

  return [toDateInputValue(fallbackDate), ""];
}

export function CourseForm({ courseId, initialValues }: CourseFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [cycleDateValues, setCycleDateValues] = useState<string[]>(() =>
    toDateInputValues(initialValues?.cycleDates, initialValues?.date)
  );

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
      courseType: initialValues?.courseType || "formation",
      cycleDates: initialValues?.courseType === "cycle"
        ? (toDateInputValues(
            initialValues?.cycleDates,
            initialValues?.date
          ) as unknown as Date[])
        : [],
      date: toDateInputValue(initialValues?.date) as unknown as Date,
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
      questions: initialValues?.questions ?? [],
      showOnHomepage: initialValues?.showOnHomepage ?? true,
      subtitle: initialValues?.subtitle || "",
      time: initialValues?.time || "10:00",
      title: initialValues?.title || "",
      youtubeUrl: initialValues?.youtubeUrl || ""
    },
    resolver: zodResolver(courseSchema)
  });

  const imageUrl = watch("imageUrl");
  const imagePublicId = watch("imagePublicId");
  const instructor = watch("instructor");
  const questions = (watch("questions") ?? []) as CourseQuestion[];
  const courseType = watch("courseType");
  const isCycle = courseType === "cycle";
  const selectedMentorValue = mentors.some((mentor) => mentor.name === instructor)
    ? instructor
    : instructor
      ? "custom"
      : "";

  useEffect(() => {
    void Promise.all([
      fetch("/api/admin/categories").then((response) => response.json()),
      fetch("/api/admin/mentors").then((response) => response.json())
    ]).then(
      ([categoryData, mentorData]: [
        { categories?: Category[] },
        { mentors?: Mentor[] }
      ]) => {
        setCategories(categoryData.categories ?? []);
        setMentors(mentorData.mentors ?? []);
      }
    );
  }, []);

  const syncCycleDates = (dates: string[]) => {
    const nextDates = dates.length >= 2 ? dates : [...dates, ""].slice(0, 2);
    const filledDates = nextDates.filter(Boolean);

    setCycleDateValues(nextDates);
    setValue("cycleDates", filledDates as unknown as Date[], {
      shouldDirty: true,
      shouldValidate: true
    });

    if (filledDates[0]) {
      setValue("date", filledDates[0] as unknown as Date, {
        shouldDirty: true,
        shouldValidate: true
      });
    }
  };

  const setCourseType = (checked: boolean) => {
    const nextType = checked ? "cycle" : "formation";

    setValue("courseType", nextType, {
      shouldDirty: true,
      shouldValidate: true
    });

    if (checked) {
      syncCycleDates(cycleDateValues);
      return;
    }

    setValue("cycleDates", [], { shouldDirty: true, shouldValidate: true });
  };

  const onInvalid = (formErrors: FieldErrors<CourseFormValues>) => {
    const firstError = Object.values(formErrors).find((error) => error?.message);
    toast.error(
      typeof firstError?.message === "string"
        ? firstError.message
        : "Veuillez corriger les erreurs du formulaire."
    );
  };

  const onSubmit = async (values: CourseFormValues) => {
    const filledCycleDates = cycleDateValues.filter(Boolean);
    const isCycleSubmission = values.courseType === "cycle";
    const cleanedQuestions = ((values.questions ?? []) as CourseQuestion[])
      .map((question) => ({
        ...question,
        label: question.label.trim(),
        options:
          question.type === "select"
            ? question.options.map((option) => option.trim()).filter(Boolean)
            : [],
        allowMultiple: question.type === "select" ? question.allowMultiple : false
      }))
      .filter((question) => question.label.length > 0);
    const payload = {
      ...values,
      cycleDates: isCycleSubmission ? filledCycleDates : [],
      date: isCycleSubmission
        ? filledCycleDates[0]
        : toDateInputValue(values.date),
      maxSeats: Number.isFinite(values.maxSeats) ? values.maxSeats : undefined,
      questions: cleanedQuestions
    };

    const response = await fetch(
      courseId ? `/api/admin/courses/${courseId}` : "/api/admin/courses",
      {
        method: courseId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
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
    <form className={adminFormClassName} onSubmit={handleSubmit(onSubmit, onInvalid)}>
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

      <label className="block">
        <span className={adminLabelClassName}>Lien video YouTube</span>
        <Input
          placeholder="https://www.youtube.com/watch?v=..."
          size="sm"
          type="url"
          {...register("youtubeUrl")}
        />
        {errors.youtubeUrl ? <p className="mt-1 text-sm text-red-600">{errors.youtubeUrl.message}</p> : null}
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
        <div className="block">
          <span className={adminLabelClassName}>Formateur *</span>
          <div className="space-y-2">
            <Select
              onChange={(event) => {
                const value = event.target.value;
                setValue("instructor", value === "custom" ? "" : value, {
                  shouldDirty: true,
                  shouldValidate: true
                });
              }}
              size="sm"
              value={selectedMentorValue}
            >
              <option value="">Selectionner un mentor</option>
              {mentors.map((mentor) => (
                <option key={mentor.id} value={mentor.name}>
                  {mentor.name}
                  {mentor.title ? ` - ${mentor.title}` : ""}
                </option>
              ))}
              <option value="custom">Nouveau formateur</option>
            </Select>
            <Input
              placeholder="Nom du formateur"
              size="sm"
              {...register("instructor")}
            />
          </div>
          {errors.instructor ? <p className="mt-1 text-sm text-red-600">{errors.instructor.message}</p> : null}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
        <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
          <Checkbox
            checked={isCycle}
            onChange={(event) => setCourseType(event.target.checked)}
          />{" "}
          Cycle de formation
        </label>
        <p className="mt-2 text-xs leading-relaxed text-slate-500">
          Cochez cette option pour ajouter plusieurs dates. Un cycle doit avoir
          au moins deux dates.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {isCycle ? (
          <div className="space-y-3 sm:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <span className={adminLabelClassName}>Dates du cycle *</span>
              <Button
                onClick={() => syncCycleDates([...cycleDateValues, ""])}
                size="sm"
                type="button"
                variant="secondary"
              >
                <Plus className="h-4 w-4" />
                Ajouter une date
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {cycleDateValues.map((dateValue, index) => (
                <div className="flex items-center gap-2" key={index}>
                  <Input
                    aria-label={`Date ${index + 1} du cycle`}
                    min={index > 0 ? cycleDateValues[index - 1] || undefined : undefined}
                    onChange={(event) => {
                      const nextDates = [...cycleDateValues];
                      nextDates[index] = event.target.value;
                      syncCycleDates(nextDates);
                    }}
                    size="sm"
                    type="date"
                    value={dateValue}
                  />
                  <button
                    aria-label={`Supprimer la date ${index + 1}`}
                    className="dentova-focus inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={cycleDateValues.length <= 2}
                    onClick={() =>
                      syncCycleDates(cycleDateValues.filter((_, itemIndex) => itemIndex !== index))
                    }
                    type="button"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
            {errors.cycleDates ? (
              <p className="text-sm text-red-600">{errors.cycleDates.message}</p>
            ) : null}
          </div>
        ) : (
          <label className="block">
            <span className={adminLabelClassName}>Date *</span>
            <Input size="sm" type="date" {...register("date", { valueAsDate: true })} />
          </label>
        )}
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
        <Input
          min="1"
          size="sm"
          type="number"
          {...register("maxSeats", {
            setValueAs: (value) => (value === "" ? undefined : Number(value))
          })}
        />
      </label>

      <CourseQuestionsBuilder
        onChange={(next) =>
          setValue("questions", next, { shouldDirty: true, shouldValidate: true })
        }
        value={questions}
      />

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
