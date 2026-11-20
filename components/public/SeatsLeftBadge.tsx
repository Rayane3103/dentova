import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

type SeatsLeftBadgeProps = {
  seatsLeft?: number | null;
  /** "overlay" sits on top of a course image, "inline" on a light surface. */
  variant?: "overlay" | "inline";
  className?: string;
};

type Level = "full" | "critical" | "low" | "available";

function levelFor(seats: number): Level {
  if (seats <= 0) return "full";
  if (seats <= 3) return "critical";
  if (seats <= 10) return "low";
  return "available";
}

function labelFor(seats: number) {
  if (seats <= 0) return "Complet";
  if (seats === 1) return "Dernière place";
  if (seats <= 3) return `Plus que ${seats} places`;
  return `${seats} places restantes`;
}

const overlayStyles: Record<Level, string> = {
  full: "bg-dentova-navy-950/80 text-white ring-1 ring-white/20 backdrop-blur-sm",
  critical: "bg-dentova-magenta text-white ring-1 ring-white/20",
  low: "bg-amber-400 text-amber-950 ring-1 ring-amber-900/10",
  available: "bg-dentova-teal-500/95 text-dentova-navy-950 ring-1 ring-white/20"
};

const inlineStyles: Record<Level, string> = {
  full: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
  critical: "bg-dentova-magenta/10 text-dentova-magenta ring-1 ring-dentova-magenta/25",
  low: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  available: "bg-dentova-mint text-dentova-teal-700 ring-1 ring-dentova-teal-200"
};

/**
 * Shows the manual `seatsLeft` number set by an admin. The number never
 * decreases on its own — an empty value hides the badge entirely.
 */
export function SeatsLeftBadge({
  seatsLeft,
  variant = "overlay",
  className
}: SeatsLeftBadgeProps) {
  if (seatsLeft == null || Number.isNaN(seatsLeft)) {
    return null;
  }

  const seats = Math.max(0, Math.trunc(seatsLeft));
  const level = levelFor(seats);
  const styles = variant === "overlay" ? overlayStyles : inlineStyles;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
        variant === "inline" && "rounded-full px-3 py-1 text-[11px]",
        styles[level],
        className
      )}
    >
      <Users className="h-3 w-3 shrink-0" />
      {labelFor(seats)}
    </span>
  );
}
