import { cn } from "@/lib/utils";
import { statusBadgeStyles, type StatusVariant } from "@/components/admin/admin-ui";

const variantLabels: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmé",
  cancelled: "Annulé",
  published: "Publié",
  draft: "Brouillon",
  new: "Nouveau",
  read: "Lu",
  active: "Actif",
  inactive: "Inactif"
};

export function StatusBadge({
  className,
  label,
  variant
}: {
  className?: string;
  label?: string;
  variant: StatusVariant | string;
}) {
  const style =
    statusBadgeStyles[variant as StatusVariant] ??
    "bg-slate-100 text-slate-600 ring-1 ring-slate-200";

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        style,
        className
      )}
    >
      {label ?? variantLabels[variant] ?? variant}
    </span>
  );
}
