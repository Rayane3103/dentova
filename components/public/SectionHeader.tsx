import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  accent?: string;
  description?: string;
  align?: "center" | "left";
  tone?: "default" | "inverse";
  icon?: React.ReactNode;
};

export function SectionHeader({
  eyebrow,
  title,
  accent,
  description,
  align = "center",
  tone = "default",
  icon
}: SectionHeaderProps) {
  const inverse = tone === "inverse";

  return (
    <div
      className={cn(
        "mx-auto max-w-2xl",
        align === "center" ? "text-center" : "text-left"
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "mb-3 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider",
            inverse ? "text-dentova-teal-300" : "text-dentova-teal-600"
          )}
        >
          {icon}
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "font-display text-2xl font-bold leading-tight sm:text-3xl",
          inverse ? "text-white" : "text-dentova-navy-900"
        )}
      >
        {title}
        {accent ? (
          <span
            className={cn(
              inverse ? "text-dentova-teal-300" : "text-dentova-teal-600"
            )}
          >
            {" "}
            {accent}
          </span>
        ) : null}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-3 text-sm leading-relaxed sm:text-base",
            inverse ? "text-white/70" : "text-dentova-navy-600"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
