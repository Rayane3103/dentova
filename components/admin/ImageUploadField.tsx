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
    if (!file) {
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

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
        className="dentova-focus flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-dentova-graphite/20 bg-dentova-ice/40 px-4 py-5 text-center transition hover:border-dentova-teal/50 hover:bg-dentova-ice"
        tabIndex={0}
      >
        {uploading ? (
          <Loader className="h-6 w-6 animate-spin text-dentova-teal" />
        ) : (
          <UploadCloud className="h-6 w-6 text-dentova-teal" />
        )}
        <span className="mt-2 text-xs font-semibold text-dentova-graphite">
          {uploading ? "Upload en cours..." : "Selectionner une image"}
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

      {value.imageUrl ? (
        <div className="relative h-32 overflow-hidden rounded-lg border border-dentova-navy/10">
          <Image
            alt="Apercu"
            className="object-cover"
            fill
            sizes="320px"
            src={value.imageUrl}
          />
        </div>
      ) : null}
    </div>
  );
}
