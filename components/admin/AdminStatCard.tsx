import Link from "next/link";
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
  const accentStyles = {
    default: "bg-slate-100 text-slate-600 group-hover:bg-slate-200",
    blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100",
    amber: "bg-amber-50 text-amber-600 group-hover:bg-amber-100",
    red: "bg-red-50 text-red-600 group-hover:bg-red-100"
  };

  const borderStyles = {
    default: "group-hover:border-slate-300",
    blue: "group-hover:border-blue-200",
    emerald: "group-hover:border-emerald-200",
    amber: "group-hover:border-amber-200",
    red: "group-hover:border-red-200"
  };

  return (
    <Link href={href}>
      <div
        className={cn(
          "group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md",
          borderStyles[accent]
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
              {label}
            </p>
            <p className="mt-1.5 text-2xl font-bold tabular-nums text-slate-900">
              {value}
            </p>
          </div>
          {Icon && (
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors",
                accentStyles[accent]
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
