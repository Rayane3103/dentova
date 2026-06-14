import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminStatCard({
  href,
  icon: Icon,
  label,
  value,
  accent = "default"
}: {
  href: string;
  icon?: LucideIcon;
  label: string;
  value: number;
  accent?: "default" | "blue" | "emerald" | "amber" | "red";
}) {
  const iconStyles: Record<string, string> = {
    default:
      "bg-slate-100 text-slate-600 group-hover:bg-slate-200",
    blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
    emerald:
      "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100",
    amber:
      "bg-amber-50 text-amber-600 group-hover:bg-amber-100",
    red: "bg-red-50 text-red-600 group-hover:bg-red-100"
  };

  const borderStyles: Record<string, string> = {
    default: "group-hover:border-slate-300",
    blue: "group-hover:border-blue-300",
    emerald: "group-hover:border-emerald-300",
    amber: "group-hover:border-amber-300",
    red: "group-hover:border-red-300"
  };

  const gradientStyles: Record<string, string> = {
    default: "from-slate-300 to-slate-400",
    blue: "from-blue-400 to-blue-500",
    emerald: "from-emerald-400 to-emerald-500",
    amber: "from-amber-400 to-amber-500",
    red: "from-red-400 to-red-500"
  };

  return (
    <a href={href}>
      <div
        className={cn(
          "group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md",
          borderStyles[accent]
        )}
      >
        {/* Accent gradient bar at top */}
        <div
          className={cn(
            "absolute inset-x-0 top-0 h-1 bg-gradient-to-r",
            gradientStyles[accent]
          )}
        />

        <div className="flex items-start justify-between gap-4 pt-1">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
              {label}
            </p>
            <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight text-slate-900 font-display">
              {value.toLocaleString("fr-DZ")}
            </p>
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
    </a>
  );
}
