"use client";

import { Loader, UploadCloud } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

type ImageValue = {
  imagePublicId?: string;
  imageUrl: string;
};

export function ImageUploadField({
  className,
  onChange,
  value
}: {
  className?: string;
  onChange: (value: ImageValue) => void;
  value: ImageValue;
}) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });
      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      onChange({
        imagePublicId: data.imagePublicId,
        imageUrl: data.imageUrl
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <label
        className="dentova-focus flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50/50 px-4 py-5 text-center transition hover:border-dentova-navy/30 hover:bg-slate-50"
        tabIndex={0}
      >
        {uploading ? (
          <Loader className="h-6 w-6 animate-spin text-dentova-navy" />
        ) : (
          <UploadCloud className="h-6 w-6 text-slate-400" />
        )}
        <span className="mt-2 text-xs font-semibold text-slate-500">
          {uploading ? "Upload en cours..." : "Sélectionner une image"}
        </span>
        <span className="mt-0.5 text-[10px] text-slate-400">
          ou collez l&apos;URL ci-dessous
        </span>
        <input
          accept="image/*"
          className="sr-only"
          disabled={uploading}
          onChange={(event) => void handleFile(event.target.files?.[0])}
          type="file"
        />
      </label>

      <Input
        onChange={(event) =>
          onChange({
            imagePublicId: value.imagePublicId,
            imageUrl: event.target.value
          })
        }
        placeholder="https://... ou /images/assets/..."
        size="sm"
        value={value.imageUrl}
      />

      {value.imageUrl && (
        <div className="relative h-40 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
          <Image
            alt="Aperçu"
            className="object-cover"
            fill
            sizes="320px"
            src={value.imageUrl}
          />
        </div>
      )}
    </div>
  );
}
