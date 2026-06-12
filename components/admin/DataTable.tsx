"use client";

import { ChevronDown, ChevronUp, ChevronsUpDown, Search } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/utils";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  sortable?: boolean;
  hidden?: "sm" | "md" | "lg" | boolean;
  render: (row: T) => ReactNode;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  emptyMessage?: string;
  pageSize?: number;
  rowKey: (row: T) => string;
  searchFields?: (keyof T)[];
  searchPlaceholder?: string;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
};

export function DataTable<T>({
  columns,
  data,
  emptyMessage = "Aucune donnée à afficher.",
  pageSize = 10,
  rowKey,
  searchFields,
  searchPlaceholder = "Rechercher...",
  title,
  subtitle,
  actions
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (!search || !searchFields || searchFields.length === 0) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      searchFields.some((field) => {
        const val = row[field];
        return val != null && String(val).toLowerCase().includes(q);
      })
    );
  }, [data, search, searchFields]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const col = columns.find((c) => c.key === sortKey);
      if (!col) return 0;
      const va = String((a as Record<string, unknown>)[sortKey] ?? "");
      const vb = String((b as Record<string, unknown>)[sortKey] ?? "");
      const cmp = va.localeCompare(vb, "fr", { sensitivity: "base" });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const paginated = sorted.slice(safePage * pageSize, (safePage + 1) * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(0);
  };

  const hiddenClass = (hidden?: "sm" | "md" | "lg" | boolean) => {
    if (!hidden) return "";
    if (hidden === "sm") return "hidden sm:table-cell";
    if (hidden === "md") return "hidden md:table-cell";
    if (hidden === "lg") return "hidden lg:table-cell";
    return "hidden";
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      {(title || searchFields || actions) && (
        <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && (
              <h2 className="text-sm font-bold text-slate-800">{title}</h2>
            )}
            {subtitle && (
              <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {searchFields && (
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  className="pl-9 sm:w-64"
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(0);
                  }}
                  placeholder={searchPlaceholder}
                  size="sm"
                  value={search}
                />
              </div>
            )}
            {actions}
          </div>
        </div>
      )}

      {/* Table */}
      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-600">
            {search ? "Aucun résultat trouvé" : emptyMessage}
          </p>
          {search && (
            <p className="mt-1 text-xs text-slate-400">
              Essayez de modifier vos termes de recherche.
            </p>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                {columns.map((col) => (
                  <th
                    className={cn(
                      "px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-slate-500",
                      hiddenClass(col.hidden)
                    )}
                    key={col.key}
                  >
                    {col.sortable ? (
                      <button
                        className="inline-flex items-center gap-1 transition hover:text-slate-700"
                        onClick={() => handleSort(col.key)}
                        type="button"
                      >
                        {col.header}
                        {sortKey === col.key ? (
                          sortDir === "asc" ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-3 w-3 opacity-30" />
                        )}
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.map((row) => (
                <tr
                  className="transition hover:bg-slate-50/70"
                  key={rowKey(row)}
                >
                  {columns.map((col) => (
                    <td
                      className={cn(
                        "px-4 py-3 text-sm text-slate-700",
                        hiddenClass(col.hidden)
                      )}
                      key={col.key}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2.5">
          <p className="text-xs text-slate-400">
            {sorted.length} résultat{sorted.length !== 1 ? "s" : ""} — page{" "}
            {safePage + 1} sur {totalPages}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              className="dentova-focus inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
              disabled={safePage === 0}
              onClick={() => setPage(safePage - 1)}
              type="button"
            >
              Précédent
            </button>
            <Select
              className="h-8 w-auto text-xs"
              onChange={(e) => setPage(Number(e.target.value))}
              size="sm"
              value={safePage}
            >
              {Array.from({ length: totalPages }, (_, i) => (
                <option key={i} value={i}>
                  {i + 1}
                </option>
              ))}
            </Select>
            <button
              className="dentova-focus inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
              disabled={safePage >= totalPages - 1}
              onClick={() => setPage(safePage + 1)}
              type="button"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
