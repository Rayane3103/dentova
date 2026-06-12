import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

export function EmptyAdminState({
  action,
  description,
  icon: Icon = Inbox,
  title
}: {
  action?: React.ReactNode;
  description: string;
  icon?: LucideIcon;
  title: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
        <Icon className="h-7 w-7 text-slate-400" />
      </div>
      <h3 className="mt-5 text-base font-bold text-slate-800">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-slate-500">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
