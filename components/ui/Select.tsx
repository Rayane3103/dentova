import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-3.5 text-sm"
} as const;

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> & {
  size?: keyof typeof sizes;
};

export function Select({ className, size = "md", ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "dentova-focus w-full rounded-lg border border-dentova-graphite/15 bg-white text-dentova-graphite shadow-[0_1px_0_rgba(16,20,23,0.04)] transition focus-visible:border-dentova-teal/40 focus-visible:bg-white",
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
