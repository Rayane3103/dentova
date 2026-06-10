import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const sizes = {
  sm: "min-h-24 px-3 py-2 text-sm",
  md: "min-h-28 px-3.5 py-2.5 text-sm"
} as const;

export function Textarea({
  className,
  size = "md",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { size?: keyof typeof sizes }) {
  return (
    <textarea
      className={cn(
        "dentova-focus w-full rounded-lg border border-dentova-graphite/15 bg-white text-dentova-graphite shadow-[0_1px_0_rgba(16,20,23,0.04)] placeholder:text-dentova-muted/60 transition focus-visible:border-dentova-teal/40 focus-visible:bg-white",
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
