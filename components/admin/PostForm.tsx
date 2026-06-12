"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { adminFormClassName, adminLabelClassName } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { postSchema } from "@/lib/validators/post";

type PostFormValues = z.infer<typeof postSchema>;

export function PostForm({
  postId,
  initialValues
}: {
  postId?: string;
  initialValues?: Partial<PostFormValues>;
}) {
  const router = useRouter();
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setValue,
    watch
  } = useForm<PostFormValues>({
    defaultValues: {
      caption: initialValues?.caption || "",
      content: initialValues?.content || "",
      imageUrl: initialValues?.imageUrl || "",
      imagePublicId: initialValues?.imagePublicId || "",
      published: initialValues?.published ?? true,
      slug: initialValues?.slug || ""
    },
    resolver: zodResolver(postSchema)
  });

  const imageUrl = watch("imageUrl");

  const onSubmit = async (values: PostFormValues) => {
    const response = await fetch(
      postId ? `/api/admin/posts/${postId}` : "/api/admin/posts",
      {
        method: postId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      }
    );

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      toast.error(body?.error || "Enregistrement impossible.");
      return;
    }

    toast.success(postId ? "Post mis à jour." : "Post créé.");
    router.push("/admin/posts");
    router.refresh();
  };

  const generateSlug = () => {
    const caption = watch("caption");
    if (!caption) return;
    const slug = caption
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);
    setValue("slug", slug);
  };

  return (
    <form className={adminFormClassName} onSubmit={handleSubmit(onSubmit)}>
      <label className="block">
        <span className={adminLabelClassName}>Légende *</span>
        <Input size="sm" {...register("caption")} />
        {errors.caption ? (
          <p className="mt-1 text-xs text-red-600">{errors.caption.message}</p>
        ) : null}
      </label>

      <label className="block">
        <span className={adminLabelClassName}>Contenu *</span>
        <Textarea
          className="min-h-36"
          size="sm"
          {...register("content")}
        />
        {errors.content ? (
          <p className="mt-1 text-xs text-red-600">{errors.content.message}</p>
        ) : null}
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={adminLabelClassName}>Slug *</span>
          <div className="flex gap-2">
            <Input className="flex-1" size="sm" {...register("slug")} />
            <Button
              onClick={generateSlug}
              size="sm"
              type="button"
              variant="outline"
            >
              Générer
            </Button>
          </div>
          {errors.slug ? (
            <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p>
          ) : null}
        </label>

        <div>
          <ImageUploadField
            value={{ imageUrl, imagePublicId: watch("imagePublicId") }}
            onChange={(val) => {
              setValue("imageUrl", val.imageUrl, { shouldValidate: true });
              if (val.imagePublicId) {
                setValue("imagePublicId", val.imagePublicId);
              }
            }}
          />
          {errors.imageUrl ? (
            <p className="mt-1 text-xs text-red-600">{errors.imageUrl.message}</p>
          ) : null}
        </div>
      </div>

      {imageUrl ? (
        <div className="relative aspect-video overflow-hidden rounded-lg border border-slate-200">
          <Image
            alt="Aperçu"
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            src={imageUrl}
          />
        </div>
      ) : null}

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
          <Checkbox {...register("published")} /> Publié
        </label>
      </div>

      <Button className="w-full" disabled={isSubmitting} size="sm" type="submit">
        {isSubmitting ? <Loader className="h-4 w-4 animate-spin" /> : null}
        {postId ? "Mettre à jour" : "Créer le post"}
      </Button>
    </form>
  );
}
