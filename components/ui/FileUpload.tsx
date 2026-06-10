import { UploadCloud } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function FileUpload({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label
      className={cn(
        "dentova-focus flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-dentova-graphite/30 bg-white px-5 py-8 text-center transition hover:border-dentova-teal hover:bg-dentova-mint",
        className
      )}
      tabIndex={0}
    >
      <UploadCloud className="h-9 w-9 text-dentova-teal" />
      <span className="mt-3 font-bold text-dentova-graphite">Select Image</span>
      <span className="text-base text-dentova-muted">
        Supports JPG, PNG, GIF, WebP jusqu&apos;a 5MB
      </span>
      <input className="sr-only" type="file" accept="image/*" {...props} />
    </label>
  );
}
