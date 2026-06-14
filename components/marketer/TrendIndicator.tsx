import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export function TrendIndicator({
  current,
  previous,
  label,
  reverse = false
}: {
  current: number;
  previous: number;
  label?: string;
  /** When true, a decrease is "good" (e.g. pending items going down) */
  reverse?: boolean;
}) {
  if (previous === 0) {
    if (current === 0) {
      return (
        <span className="inline-flex items-center gap-1 text-xs text-slate-400">
          <Minus className="h-3 w-3" />
          {label ?? "Aucune donnée"}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
        <TrendingUp className="h-3 w-3" />
        +{current} {label ?? "nouveau"}
      </span>
    );
  }

  const diff = current - previous;
  const pct = Math.round((Math.abs(diff) / previous) * 100);
  const isUp = diff > 0;
  const isGood = reverse ? !isUp : isUp;

  if (diff === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
        <Minus className="h-3 w-3" />
        0%
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium",
        isGood ? "text-emerald-600" : "text-red-500"
      )}
    >
      {isUp ? (
        <TrendingUp className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      )}
      {isUp ? "+" : "-"}
      {pct}% {label ?? "vs mois précédent"}
    </span>
  );
}
