"use client";

import { Loader, Mail, Phone, Search, ShoppingCart } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  tableCellClassName,
  tableHeaderClassName,
  tableRowClassName
} from "@/components/admin/admin-ui";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Input } from "@/components/ui/Input";
import { Dropdown, type DropdownOption } from "@/components/ui/Dropdown";
import type { AbandonedCartStatusCounts } from "@/lib/data/abandoned-cart";
import { cn } from "@/lib/utils";
import type { AbandonedCartRecord, AbandonedCartStatus } from "@/types";

const statusOptions: DropdownOption[] = [
  { value: "new", label: "À contacter", dotClassName: "bg-blue-500" },
  { value: "contacted", label: "Contacté", dotClassName: "bg-indigo-500" },
  { value: "lost", label: "Perdu", dotClassName: "bg-slate-400" }
];

const statusTriggerStyles: Record<AbandonedCartStatus, string> = {
  new: "border-blue-200 bg-blue-50 text-blue-700",
  contacted: "border-indigo-200 bg-indigo-50 text-indigo-700",
  lost: "border-slate-200 bg-slate-100 text-slate-500"
};

const tabs: { key: "all" | AbandonedCartStatus; label: string }[] = [
  { key: "all", label: "Tous" },
  { key: "new", label: "À contacter" },
  { key: "contacted", label: "Contactés" },
  { key: "lost", label: "Perdus" }
];

type ListResponse = {
  carts: AbandonedCartRecord[];
  counts: AbandonedCartStatusCounts;
  page: number;
  pages: number;
  total: number;
};

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(value));
}

/** "il y a 2 h" — only rendered after mount to avoid a hydration mismatch. */
function formatRelative(value: string, now: number) {
  const minutes = Math.max(0, Math.floor((now - new Date(value).getTime()) / 60_000));
  if (minutes < 60) return `il y a ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;

  const days = Math.floor(hours / 24);
  if (days < 31) return `il y a ${days} j`;

  return `il y a ${Math.floor(days / 30)} mois`;
}

export function AbandonedCartsList({
  initialCarts,
  initialCounts,
  initialPages,
  initialTotal
}: {
  initialCarts: AbandonedCartRecord[];
  initialCounts: AbandonedCartStatusCounts;
  initialPages: number;
  initialTotal: number;
}) {
  const [carts, setCarts] = useState(initialCarts);
  const [counts, setCounts] = useState(initialCounts);
  const [total, setTotal] = useState(initialTotal);
  const [pages, setPages] = useState(initialPages);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<"all" | AbandonedCartStatus>("all");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [now, setNow] = useState<number | null>(null);

  const isFirstRender = useRef(true);

  useEffect(() => {
    setNow(Date.now());
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 350);
    return () => clearTimeout(timer);
  }, [query]);

  const load = useCallback(async () => {
    setLoading(true);

    const params = new URLSearchParams({ page: String(page), status });
    if (debouncedQuery) params.set("q", debouncedQuery);

    try {
      const response = await fetch(`/api/admin/abandoned-carts?${params.toString()}`);
      if (!response.ok) throw new Error("Request failed");

      const data = (await response.json()) as ListResponse;
      setCarts(data.carts);
      setCounts(data.counts);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      toast.error("Chargement impossible.");
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, page, status]);

  useEffect(() => {
    // Page 1 is already rendered by the server component.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    void load();
  }, [load]);

  const updateStatus = async (id: string, next: AbandonedCartStatus) => {
    const target = carts.find((cart) => cart.id === id);
    if (!target || target.status === next) return;

    const previousStatus = target.status;
    setSavingId(id);
    setCarts((current) =>
      current.map((cart) => (cart.id === id ? { ...cart, status: next } : cart))
    );

    try {
      const response = await fetch("/api/admin/abandoned-carts", {
        body: JSON.stringify({ id, status: next }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH"
      });
      if (!response.ok) throw new Error("Update failed");

      setCounts((current) => ({
        ...current,
        [previousStatus]: Math.max(0, current[previousStatus] - 1),
        [next]: current[next] + 1
      }));
      toast.success("Statut mis à jour.");
    } catch {
      setCarts((current) =>
        current.map((cart) =>
          cart.id === id ? { ...cart, status: previousStatus } : cart
        )
      );
      toast.error("Mise à jour impossible.");
    } finally {
      setSavingId(null);
    }
  };

  const selectTab = (key: "all" | AbandonedCartStatus) => {
    setStatus(key);
    setPage(1);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-9"
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Rechercher un nom, email, téléphone…"
            size="sm"
            value={query}
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {tabs.map((tab) => (
            <button
              className={cn(
                "dentova-focus rounded-lg px-3 py-1.5 text-xs font-bold transition",
                status === tab.key
                  ? "bg-dentova-navy text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
              key={tab.key}
              onClick={() => selectTab(tab.key)}
              type="button"
            >
              {tab.label}
              <span className="ml-1.5 opacity-70">
                {tab.key === "all" ? counts.all : counts[tab.key]}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <Loader className="h-4 w-4 animate-spin text-slate-400" />
        ) : null}
      </div>

      {carts.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <ShoppingCart className="h-7 w-7 text-slate-400" />
          </div>
          <h3 className="mt-5 text-base font-bold text-slate-800">
            Aucun panier oublié
          </h3>
          <p className="mt-1.5 text-sm text-slate-500">
            Les formulaires de réservation laissés incomplets apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] border-collapse">
            <thead>
              <tr>
                <th className={tableHeaderClassName}>Client</th>
                <th className={tableHeaderClassName}>Formation</th>
                <th className={tableHeaderClassName}>Wilaya</th>
                <th className={tableHeaderClassName}>Progression</th>
                <th className={tableHeaderClassName}>Abandonné</th>
                <th className={tableHeaderClassName}>Tentatives</th>
                <th className={tableHeaderClassName}>Statut</th>
              </tr>
            </thead>
            <tbody>
              {carts.map((cart) => (
                <tr className={tableRowClassName} key={cart.id}>
                  <td className={tableCellClassName}>
                    <p className="font-bold text-slate-800">
                      {cart.fullName || "Nom non renseigné"}
                    </p>
                    <div className="mt-1 flex flex-col gap-0.5 text-xs text-slate-500">
                      {cart.email ? (
                        <span className="inline-flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {cart.email}
                        </span>
                      ) : null}
                      {cart.phone ? (
                        <span className="inline-flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {cart.phone}
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className={tableCellClassName}>{cart.courseTitle}</td>
                  <td className={tableCellClassName}>{cart.wilaya || "—"}</td>
                  <td className={tableCellClassName}>
                    <span className="text-xs font-semibold text-slate-600">
                      {cart.filledFields}/{cart.totalFields} champs
                    </span>
                  </td>
                  <td className={tableCellClassName}>
                    <span
                      className="text-xs text-slate-500"
                      title={formatShortDate(cart.lastActivityAt)}
                    >
                      {now === null
                        ? formatShortDate(cart.lastActivityAt)
                        : formatRelative(cart.lastActivityAt, now)}
                    </span>
                  </td>
                  <td className={tableCellClassName}>
                    <StatusBadge
                      label={`${cart.attempts}×`}
                      variant={cart.attempts > 1 ? "pending" : "draft"}
                    />
                  </td>
                  <td className={tableCellClassName}>
                    <Dropdown
                      aria-label="Statut du panier"
                      className="w-[150px]"
                      disabled={savingId === cart.id}
                      onChange={(next) =>
                        updateStatus(cart.id, next as AbandonedCartStatus)
                      }
                      options={statusOptions}
                      size="sm"
                      tone="bare"
                      triggerClassName={cn(
                        "border text-xs font-bold uppercase tracking-wide",
                        statusTriggerStyles[cart.status]
                      )}
                      value={cart.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2.5">
        <p className="text-xs font-semibold text-slate-500">
          {total} panier{total !== 1 ? "s" : ""} oublié{total !== 1 ? "s" : ""}
        </p>
        <div className="flex items-center gap-2">
          <button
            className="dentova-focus rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={page <= 1 || loading}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            type="button"
          >
            Précédent
          </button>
          <span className="text-xs font-semibold text-slate-500">
            {page} / {pages}
          </span>
          <button
            className="dentova-focus rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={page >= pages || loading}
            onClick={() => setPage((current) => Math.min(pages, current + 1))}
            type="button"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
}
