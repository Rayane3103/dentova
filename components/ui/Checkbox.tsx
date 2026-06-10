import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Checkbox({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      className={cn(
        "dentova-focus h-4 w-4 rounded border-dentova-graphite/30 text-dentova-teal",
        className
      )}
      {...props}
    />
  );
}
