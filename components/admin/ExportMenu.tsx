"use client";

import {
  ChevronDown,
  Download,
  FileSpreadsheet,
  FileText,
  Loader,
  Sheet
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  type ExportColumn,
  type ExportFormat,
  exportTable
} from "@/lib/export/table-export";
import { cn } from "@/lib/utils";

type ExportMenuProps<T> = {
  columns: ExportColumn<T>[];
  rows: T[];
  filename: string;
  title: string;
  disabled?: boolean;
  /** Optional label shown in the menu (e.g. total across all pages). */
  countLabel?: string;
  /** When provided, the rows to export are resolved lazily (e.g. all pages). */
  resolveRows?: () => Promise<T[]>;
  /** Compact icon-only trigger. */
  compact?: boolean;
};

const formatItems: {
  format: ExportFormat;
  label: string;
  hint: string;
  icon: typeof FileText;
}[] = [
  { format: "csv", label: "CSV", hint: ".csv", icon: Sheet },
  { format: "excel", label: "Excel", hint: ".xlsx", icon: FileSpreadsheet },
  { format: "pdf", label: "PDF", hint: ".pdf", icon: FileText }
];

export function ExportMenu<T>({
  columns,
  rows,
  filename,
  title,
  disabled,
  countLabel,
  resolveRows,
  compact
}: ExportMenuProps<T>) {
  const [open, setOpen] = useState(false);
  const [busyFormat, setBusyFormat] = useState<ExportFormat | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleExport = async (format: ExportFormat) => {
    if (!resolveRows && rows.length === 0) {
      toast.error("Aucune donnée à exporter.");
      return;
    }

    setBusyFormat(format);
    try {
      const data = resolveRows ? await resolveRows() : rows;
      if (data.length === 0) {
        toast.error("Aucune donnée à exporter.");
        return;
      }
      await exportTable({ format, filename, title, columns, rows: data });
      setOpen(false);
    } catch {
      toast.error("Export impossible. Réessayez.");
    } finally {
      setBusyFormat(null);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        className={cn(
          "dentova-focus inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50",
          compact ? "w-9 justify-center" : "px-3"
        )}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        title="Exporter"
        type="button"
      >
        <Download className="h-4 w-4" />
        {compact ? null : (
          <>
            Exporter
            <ChevronDown
              className={cn("h-3.5 w-3.5 transition", open && "rotate-180")}
            />
          </>
        )}
      </button>

      {open ? (
        <div className="absolute right-0 z-20 mt-1.5 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
          <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">
            {countLabel ?? `${rows.length} entrée(s)`}
          </p>
          {formatItems.map((item) => {
            const Icon = item.icon;
            const isBusy = busyFormat === item.format;
            return (
              <button
                className="dentova-focus flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-dentova-mint/40 disabled:opacity-60"
                disabled={busyFormat !== null}
                key={item.format}
                onClick={() => void handleExport(item.format)}
                type="button"
              >
                {isBusy ? (
                  <Loader className="h-4 w-4 animate-spin text-dentova-teal" />
                ) : (
                  <Icon className="h-4 w-4 text-dentova-navy" />
                )}
                <span className="flex-1">{item.label}</span>
                <span className="text-[10px] text-slate-400">{item.hint}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
