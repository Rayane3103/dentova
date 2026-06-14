import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function MarketerStatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  accent = "default",
  className
}: {
  icon?: LucideIcon;
  label: string;
  value: number | string;
  subtitle?: React.ReactNode;
  accent?: "default" | "navy" | "teal" | "magenta" | "emerald" | "amber";
  className?: string;
}) {
  const iconStyles: Record<string, string> = {
    default:
      "bg-slate-100 text-slate-600 group-hover:bg-slate-200",
    navy: "bg-dentova-navy/10 text-dentova-navy group-hover:bg-dentova-navy/15",
    teal: "bg-dentova-teal-50 text-dentova-teal-600 group-hover:bg-dentova-teal-100",
    magenta:
      "bg-dentova-magenta/10 text-dentova-magenta group-hover:bg-dentova-magenta/15",
    emerald:
      "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100",
    amber:
      "bg-amber-50 text-amber-600 group-hover:bg-amber-100"
  };

  const borderStyles: Record<string, string> = {
    default: "group-hover:border-slate-300",
    navy: "group-hover:border-dentova-navy/30",
    teal: "group-hover:border-dentova-teal-300",
    magenta: "group-hover:border-dentova-magenta/40",
    emerald: "group-hover:border-emerald-300",
    amber: "group-hover:border-amber-300"
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md",
        borderStyles[accent],
        className
      )}
    >
      {/* Accent gradient bar at top */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1 bg-gradient-to-r",
          accent === "navy" && "from-dentova-navy to-dentova-purple",
          accent === "teal" && "from-dentova-teal-400 to-dentova-cyan",
          accent === "magenta" && "from-dentova-magenta to-dentova-coral",
          accent === "emerald" && "from-emerald-400 to-emerald-500",
          accent === "amber" && "from-amber-400 to-amber-500",
          accent === "default" && "from-slate-300 to-slate-400"
        )}
      />

      <div className="flex items-start justify-between gap-4 pt-1">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight text-slate-900 font-display">
            {typeof value === "number" ? value.toLocaleString("fr-DZ") : value}
          </p>
          {subtitle && <div className="mt-1.5">{subtitle}</div>}
        </div>
        {Icon && (
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors",
              iconStyles[accent]
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  );
}
