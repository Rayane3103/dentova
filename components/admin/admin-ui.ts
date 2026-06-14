// Admin form card styling
export const adminFormClassName =
  "rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-5";

// Form label styling
export const adminLabelClassName =
  "mb-1.5 block text-xs font-semibold uppercase tracking-[0.06em] text-slate-500";

// Content card styling
export const adminCardClassName =
  "rounded-2xl border border-slate-200/80 bg-white shadow-sm";

// Page section panel
export const adminPanelClassName = "mt-5 space-y-3";

// Badge base styling
export const adminBadgeClassName =
  "inline-flex shrink-0 items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600";

// Status badge variants
export const statusBadgeStyles = {
  pending:
    "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  confirmed:
    "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  cancelled:
    "bg-red-50 text-red-600 ring-1 ring-red-200",
  published:
    "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  draft:
    "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  new:
    "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  read:
    "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
  active:
    "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  inactive:
    "bg-slate-100 text-slate-500 ring-1 ring-slate-200"
} as const;

export type StatusVariant = keyof typeof statusBadgeStyles;

// DataTable action button
export const tableActionClassName =
  "dentova-focus inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700";

// DataTable header cell
export const tableHeaderClassName =
  "border-b border-slate-200 bg-slate-50/50 px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-slate-500";

// DataTable cell
export const tableCellClassName = "border-b border-slate-100 px-4 py-3 text-sm text-slate-700";

// DataTable row
export const tableRowClassName =
  "transition hover:bg-slate-50/70";
