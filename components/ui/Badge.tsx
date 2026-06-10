import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-dentova-mint px-3 py-1 text-sm font-bold text-dentova-graphite ring-1 ring-dentova-teal/20",
        className
      )}
      {...props}
    />
  );
}
