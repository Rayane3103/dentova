"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type StarRatingProps = {
  onChange: (value: number) => void;
  value: number;
  variant?: "light" | "dark";
};

export function StarRating({
  onChange,
  value,
  variant = "light"
}: StarRatingProps) {
  const dark = variant === "dark";

  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Note">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= value;

        return (
          <button
            key={star}
            aria-checked={active}
            aria-label={`${star} etoile${star > 1 ? "s" : ""}`}
            className={cn(
              "rounded-lg p-1 transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dentova-teal-500",
              active ? "text-amber-400" : dark ? "text-white/25" : "text-dentova-navy-200"
            )}
            onClick={() => onChange(star)}
            role="radio"
            type="button"
          >
            <Star
              className="h-6 w-6"
              fill={active ? "currentColor" : "none"}
              strokeWidth={active ? 0 : 2}
            />
          </button>
        );
      })}
    </div>
  );
}
