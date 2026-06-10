import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "dentova-focus h-12 w-full rounded-lg border border-dentova-graphite/20 bg-white/90 px-4 text-lg text-dentova-graphite shadow-[0_1px_0_rgba(16,20,23,0.05)] placeholder:text-dentova-muted/60 transition focus-visible:bg-white",
        className
      )}
      {...props}
    />
  );
}
