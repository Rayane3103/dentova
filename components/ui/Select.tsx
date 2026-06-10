import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "dentova-focus h-12 w-full rounded-lg border border-dentova-graphite/20 bg-white/90 px-4 text-lg text-dentova-graphite shadow-[0_1px_0_rgba(16,20,23,0.05)] transition focus-visible:bg-white",
        className
      )}
      {...props}
    />
  );
}
