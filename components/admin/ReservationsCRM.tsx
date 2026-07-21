"use client";

import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader,
  MapPin,
  MessageSquare,
  Search,
  Trash2,
  X
} from "lucide-react";
import { Fragment, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { adminLabelClassName } from "@/components/admin/admin-ui";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ExportMenu } from "@/components/admin/ExportMenu";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import type { ReservationStatusCounts } from "@/lib/data/reservation-record";
import type { ExportColumn } from "@/lib/export/table-export";
import { cn } from "@/lib/utils";
import type { ReservationAnswer } from "@/types";

export type ReservationStatus = "pending" | "confirmed" | "paid" | "cancelled";

export type ReservationCourse = {
  id: string;
  title: string;
  price: number;
  date?: string;
  time?: string;
  location?: string;
};

export type ReservationRecord = {
  id: string;
  courseId: string;
  courseTitle: string;
  coursePrice?: number;
  courseDate?: string;
  courseTime?: string;
  courseLocation?: string;
  createdAt: string;
  email: string;
  fullName: string;
  message?: string;
  phone: string;
  profession?: string;
  status: ReservationStatus;
  answers: ReservationAnswer[];
  updatedAt?: string;
  wilaya: string;
};

const statusOptions = [
  { value: "pending", label: "En attente" },
  { value: "confirmed", label: "Confirmée" },
  { value: "paid", label: "Payé" },
  { value: "cancelled", label: "Annulée" }
];

const statusSelectStyles: Record<ReservationStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  confirmed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  paid: "border-sky-200 bg-sky-50 text-sky-700",
  cancelled: "border-red-200 bg-red-50 text-red-600"
};

const statusLabels: Record<ReservationStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  paid: "Payé",
  cancelled: "Annulée"
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatDayOnly(value: string | undefined) {
  if (!value) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(value));
}

function answersToText(answers: ReservationAnswer[]) {
  return answers
    .map((answer) => `${answer.label}: ${answer.value.join(", ")}`)
    .join(" | ");
}

const reservationExportColumns: ExportColumn<ReservationRecord>[] = [
  { header: "Nom complet", value: (row) => row.fullName, width: 24 },
  { header: "Email", value: (row) => row.email, width: 26 },
  { header: "Téléphone", value: (row) => row.phone, width: 16 },
  { header: "Wilaya", value: (row) => row.wilaya, width: 16 },
  { header: "Profession", value: (row) => row.profession ?? "", width: 18 },
  { header: "Formation", value: (row) => row.courseTitle, width: 28 },
  { header: "Date événement", value: (row) => formatDayOnly(row.courseDate), width: 16 },
  { header: "Heure", value: (row) => row.courseTime ?? "", width: 10 },
  { header: "Lieu", value: (row) => row.courseLocation ?? "", width: 16 },
  {
    header: "Prix (DZD)",
    value: (row) => (row.coursePrice != null ? row.coursePrice : ""),
    width: 12
  },
  { header: "Statut", value: (row) => statusLabels[row.status], width: 14 },
  { header: "Réponses", value: (row) => answersToText(row.answers), width: 40 },
  { header: "Message", value: (row) => row.message ?? "", width: 30 },
  {
    header: "Date réservation",
    value: (row) => formatDayOnly(row.createdAt),
    width: 16
  }
];

function formatPrice(price: number | undefined) {
  if (price == null) return "—";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "DZD",
    maximumFractionDigits: 0
  }).format(price);
}

export function ReservationsCRM({
  courses,
  initialReservations,
  initialTotal,
  initialCounts,
  pageSize
}: {
  courses: ReservationCourse[];
  initialReservations: ReservationRecord[];
  initialTotal: number;
  initialCounts: ReservationStatusCounts;
  pageSize: number;
}) {
  const [rows, setRows] = useState(initialReservations);
  const [total, setTotal] = useState(initialTotal);
  const [counts, setCounts] = useState<ReservationStatusCounts>(initialCounts);
  const [pages, setPages] = useState(Math.max(1, Math.ceil(initialTotal / pageSize)));
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | ReservationStatus>("all");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, ReservationRecord>>({});
  const [pendingDelete, setPendingDelete] = useState<ReservationRecord | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<ReservationStatus | "">("");
  const [bulkBusy, setBulkBusy] = useState(false);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const firstRender = useRef(true);
  const requestId = useRef(0);

  const buildParams = (extra?: Record<string, string>) => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("q", debouncedSearch);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (courseFilter !== "all") params.set("courseId", courseFilter);
    for (const [key, value] of Object.entries(extra ?? {})) {
      params.set(key, value);
    }
    return params;
  };

  const reload = () => setRefreshKey((key) => key + 1);

  // Debounce the search box; reset to the first page when it changes.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(timeout);
  }, [search]);

  // Fetch the current page whenever filters, page, or a manual refresh change.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const id = ++requestId.current;
    setLoading(true);

    const params = buildParams({ page: String(page), limit: String(pageSize) });

    fetch(`/api/admin/reservations?${params.toString()}`)
      .then((response) => {
        if (!response.ok) throw new Error("load failed");
        return response.json();
      })
      .then((data: {
        reservations: ReservationRecord[];
        total: number;
        pages: number;
        counts: ReservationStatusCounts;
      }) => {
        if (id !== requestId.current) return;
        setRows(data.reservations);
        setTotal(data.total);
        setPages(data.pages);
        setCounts(data.counts);
        setSelectedIds((prev) => {
          const ids = new Set(data.reservations.map((row) => row.id));
          return new Set([...prev].filter((selected) => ids.has(selected)));
        });
      })
      .catch(() => {
        if (id === requestId.current) toast.error("Chargement impossible.");
      })
      .finally(() => {
        if (id === requestId.current) setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch, statusFilter, courseFilter, refreshKey, pageSize]);

  const getDraft = (row: ReservationRecord) => drafts[row.id] ?? row;

  const patchReservation = async (
    id: string,
    patch: Partial<ReservationRecord>,
    options?: { silent?: boolean }
  ) => {
    setSavingId(id);
    try {
      const response = await fetch("/api/admin/reservations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...patch })
      });
      if (!response.ok) throw new Error("Update failed");

      setDrafts((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
      reload();

      if (!options?.silent) toast.success("Réservation mise à jour.");
    } catch {
      toast.error("Mise à jour impossible.");
    } finally {
      setSavingId(null);
    }
  };

  const updateDraft = (id: string, patch: Partial<ReservationRecord>) => {
    setDrafts((current) => ({
      ...current,
      [id]: { ...getDraft(rows.find((row) => row.id === id)!), ...patch }
    }));
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;

    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/admin/reservations/${pendingDelete.id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Delete failed");

      if (expandedId === pendingDelete.id) setExpandedId(null);
      reload();
      toast.success("Réservation supprimée.");
    } catch {
      toast.error("Suppression impossible.");
    } finally {
      setDeleteLoading(false);
      setPendingDelete(null);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const allOnPageSelected =
    rows.length > 0 && rows.every((row) => selectedIds.has(row.id));

  const toggleSelectAll = () => {
    setSelectedIds((current) => {
      if (rows.every((row) => current.has(row.id))) {
        const next = new Set(current);
        rows.forEach((row) => next.delete(row.id));
        return next;
      }
      const next = new Set(current);
      rows.forEach((row) => next.add(row.id));
      return next;
    });
  };

  const selectedRows = rows.filter((row) => selectedIds.has(row.id));

  const applyBulkStatus = async () => {
    if (!bulkStatus || selectedIds.size === 0) return;
    setBulkBusy(true);
    try {
      const results = await Promise.allSettled(
        [...selectedIds].map((id) =>
          fetch("/api/admin/reservations", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status: bulkStatus })
          }).then((response) => {
            if (!response.ok) throw new Error("bulk status failed");
          })
        )
      );
      const failed = results.filter((result) => result.status === "rejected").length;
      if (failed > 0) {
        toast.error(`${failed} réservation(s) non mises à jour.`);
      } else {
        toast.success("Statut mis à jour pour la sélection.");
      }
      setBulkStatus("");
      reload();
    } finally {
      setBulkBusy(false);
    }
  };

  const applyBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    setBulkBusy(true);
    try {
      const results = await Promise.allSettled(
        [...selectedIds].map((id) =>
          fetch(`/api/admin/reservations/${id}`, { method: "DELETE" }).then(
            (response) => {
              if (!response.ok) throw new Error("bulk delete failed");
            }
          )
        )
      );
      const failed = results.filter((result) => result.status === "rejected").length;
      if (failed > 0) {
        toast.error(`${failed} réservation(s) non supprimée(s).`);
      } else {
        toast.success("Sélection supprimée.");
      }
      setExpandedId(null);
      reload();
    } finally {
      setBulkBusy(false);
      setConfirmBulkDelete(false);
    }
  };

  const resolveAllRows = async () => {
    const params = buildParams({ all: "1" });
    const response = await fetch(`/api/admin/reservations?${params.toString()}`);
    if (!response.ok) throw new Error("export load failed");
    const data = (await response.json()) as { reservations: ReservationRecord[] };
    return data.reservations;
  };

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-9"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher par nom, téléphone, email..."
            size="sm"
            value={search}
          />
        </div>
        <div className="flex gap-3">
          <Select
            className="w-44"
            onChange={(event) => {
              setCourseFilter(event.target.value);
              setPage(1);
            }}
            size="sm"
            value={courseFilter}
          >
            <option value="all">Toutes les formations</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </Select>
          <Select
            className="w-44"
            onChange={(event) => {
              setStatusFilter(event.target.value as "all" | ReservationStatus);
              setPage(1);
            }}
            size="sm"
            value={statusFilter}
          >
            <option value="all">Tous ({counts.all})</option>
            <option value="pending">En attente ({counts.pending})</option>
            <option value="confirmed">Confirmées ({counts.confirmed})</option>
            <option value="paid">Payé ({counts.paid})</option>
            <option value="cancelled">Annulées ({counts.cancelled})</option>
          </Select>
          <ExportMenu
            columns={reservationExportColumns}
            countLabel={`${total} au total`}
            filename="dentova-reservations"
            resolveRows={resolveAllRows}
            rows={rows}
            title="Réservations"
          />
        </div>
      </div>

      {/* Bulk toolbar */}
      {selectedIds.size > 0 ? (
        <div className="flex flex-col gap-3 rounded-xl border border-dentova-navy/20 bg-dentova-navy/5 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <button
              aria-label="Effacer la sélection"
              className="dentova-focus inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:text-slate-700"
              onClick={() => setSelectedIds(new Set())}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
            <span className="text-sm font-bold text-dentova-navy">
              {selectedIds.size} sélectionnée{selectedIds.size !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              className="w-40"
              disabled={bulkBusy}
              onChange={(event) =>
                setBulkStatus(event.target.value as ReservationStatus | "")
              }
              size="sm"
              value={bulkStatus}
            >
              <option value="">Changer le statut…</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Button
              disabled={!bulkStatus || bulkBusy}
              onClick={() => void applyBulkStatus()}
              size="sm"
              type="button"
            >
              {bulkBusy ? <Loader className="h-3.5 w-3.5 animate-spin" /> : null}
              Appliquer
            </Button>
            <ExportMenu
              columns={reservationExportColumns}
              filename="dentova-reservations-selection"
              rows={selectedRows}
              title="Réservations (sélection)"
            />
            <button
              className="dentova-focus inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
              disabled={bulkBusy}
              onClick={() => setConfirmBulkDelete(true)}
              type="button"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Supprimer
            </button>
          </div>
        </div>
      ) : null}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Liste des réservations</h2>
            <p className="text-xs text-slate-400">
              {total} réservation{total !== 1 ? "s" : ""}
              {loading ? " · chargement…" : ""}
            </p>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <p className="mt-4 text-sm font-medium text-slate-600">
              Aucune réservation trouvée
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Modifiez vos filtres pour voir plus de résultats.
            </p>
          </div>
        ) : (
          <div className={cn("overflow-x-auto transition", loading && "opacity-60")}>
            <table className="w-full min-w-[1000px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-[0.06em] text-slate-500">
                  <th className="w-10 px-3 py-3">
                    <Checkbox
                      aria-label="Tout sélectionner"
                      checked={allOnPageSelected}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="w-10 px-3 py-3" />
                  <th className="px-3 py-3">Client</th>
                  <th className="px-3 py-3">Contact</th>
                  <th className="px-3 py-3">Formation</th>
                  <th className="px-3 py-3">Prix</th>
                  <th className="px-3 py-3">Statut</th>
                  <th className="px-3 py-3">Date</th>
                  <th className="w-10 px-3 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rows.map((row) => {
                  const expanded = expandedId === row.id;
                  const draft = getDraft(row);
                  const isSaving = savingId === row.id;
                  const isSelected = selectedIds.has(row.id);

                  return (
                    <Fragment key={row.id}>
                      <tr
                        className={cn(
                          "group transition hover:bg-slate-50/70",
                          (expanded || isSelected) && "bg-slate-50/70"
                        )}
                      >
                        <td className="px-3 py-3">
                          <Checkbox
                            aria-label={`Sélectionner ${row.fullName}`}
                            checked={isSelected}
                            onChange={() => toggleSelect(row.id)}
                          />
                        </td>
                        <td className="px-3 py-3">
                          <button
                            aria-expanded={expanded}
                            aria-label={expanded ? "Replier" : "Développer"}
                            className="dentova-focus inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-slate-300 hover:text-slate-600"
                            onClick={() => setExpandedId(expanded ? null : row.id)}
                            type="button"
                          >
                            {expanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                        <td className="px-3 py-3">
                          <p className="text-sm font-semibold text-slate-800">
                            {row.fullName}
                          </p>
                          {row.profession && (
                            <p className="text-xs text-slate-400">{row.profession}</p>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          <div className="space-y-0.5">
                            <p className="text-sm text-slate-600">{row.phone}</p>
                            <p className="text-xs text-slate-400">{row.email}</p>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <p className="max-w-[200px] truncate text-sm text-slate-700">
                            {row.courseTitle}
                          </p>
                        </td>
                        <td className="px-3 py-3">
                          <span className="text-sm font-semibold text-slate-800">
                            {formatPrice(row.coursePrice)}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <select
                            className={cn(
                              "dentova-focus h-8 min-w-[130px] rounded-lg border px-2.5 text-xs font-bold uppercase tracking-wide transition",
                              statusSelectStyles[row.status]
                            )}
                            disabled={isSaving}
                            onChange={(event) =>
                              void patchReservation(row.id, {
                                status: event.target.value as ReservationStatus
                              })
                            }
                            value={row.status}
                          >
                            {statusOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-3 text-xs text-slate-400">
                          {formatDate(row.createdAt)}
                        </td>
                        <td className="px-3 py-3">
                          <button
                            aria-label={`Supprimer ${row.fullName}`}
                            className={cn(
                              "dentova-focus inline-flex h-7 w-7 items-center justify-center rounded-lg border border-transparent text-slate-400 transition",
                              "opacity-100 sm:opacity-0 sm:group-hover:opacity-100",
                              "hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                            )}
                            disabled={isSaving}
                            onClick={() => setPendingDelete(row)}
                            title="Supprimer"
                            type="button"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Detail Row */}
                      {expanded && (
                        <tr className="border-b border-slate-100 bg-slate-50/30">
                          <td className="px-3 py-0" colSpan={9}>
                            <div className="py-5 pl-10 pr-4">
                              <div className="mb-5 flex items-center justify-between gap-4">
                                <div>
                                  <h3 className="text-sm font-bold text-slate-800">
                                    Détails de la réservation
                                  </h3>
                                  <p className="text-xs text-slate-400">
                                    Modifiez les informations du client
                                  </p>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-400">
                                  {row.wilaya && (
                                    <span className="inline-flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {row.wilaya}
                                    </span>
                                  )}
                                  {row.updatedAt && (
                                    <span className="inline-flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      Mis à jour {formatDate(row.updatedAt)}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <label className="block">
                                  <span className={adminLabelClassName}>Nom complet</span>
                                  <Input
                                    onChange={(event) =>
                                      updateDraft(row.id, { fullName: event.target.value })
                                    }
                                    size="sm"
                                    value={draft.fullName}
                                  />
                                </label>
                                <label className="block">
                                  <span className={adminLabelClassName}>Téléphone</span>
                                  <Input
                                    onChange={(event) =>
                                      updateDraft(row.id, { phone: event.target.value })
                                    }
                                    size="sm"
                                    value={draft.phone}
                                  />
                                </label>
                                <label className="block">
                                  <span className={adminLabelClassName}>Email</span>
                                  <Input
                                    onChange={(event) =>
                                      updateDraft(row.id, { email: event.target.value })
                                    }
                                    size="sm"
                                    type="email"
                                    value={draft.email}
                                  />
                                </label>
                                <label className="block">
                                  <span className={adminLabelClassName}>Wilaya</span>
                                  <Input
                                    onChange={(event) =>
                                      updateDraft(row.id, { wilaya: event.target.value })
                                    }
                                    size="sm"
                                    value={draft.wilaya}
                                  />
                                </label>
                                <label className="block">
                                  <span className={adminLabelClassName}>Profession</span>
                                  <Input
                                    onChange={(event) =>
                                      updateDraft(row.id, { profession: event.target.value })
                                    }
                                    size="sm"
                                    value={draft.profession || ""}
                                  />
                                </label>
                                <label className="block">
                                  <span className={adminLabelClassName}>Formation</span>
                                  <Select
                                    onChange={(event) => {
                                      const course = courses.find(
                                        (item) => item.id === event.target.value
                                      );
                                      updateDraft(row.id, {
                                        courseId: event.target.value,
                                        courseTitle: course?.title || draft.courseTitle,
                                        coursePrice: course?.price ?? draft.coursePrice,
                                        courseDate: course?.date ?? draft.courseDate,
                                        courseTime: course?.time ?? draft.courseTime,
                                        courseLocation:
                                          course?.location ?? draft.courseLocation
                                      });
                                    }}
                                    size="sm"
                                    value={draft.courseId}
                                  >
                                    {courses.map((course) => (
                                      <option key={course.id} value={course.id}>
                                        {course.title}
                                      </option>
                                    ))}
                                  </Select>
                                </label>
                                <label className="block sm:col-span-2 lg:col-span-3">
                                  <span className={adminLabelClassName}>Message</span>
                                  <Textarea
                                    onChange={(event) =>
                                      updateDraft(row.id, { message: event.target.value })
                                    }
                                    size="sm"
                                    value={draft.message || ""}
                                  />
                                </label>
                              </div>

                              {row.answers.length > 0 ? (
                                <div className="mt-5 rounded-lg border border-dentova-teal/30 bg-dentova-mint/30 p-4">
                                  <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-dentova-navy">
                                    <MessageSquare className="h-3.5 w-3.5" />
                                    Réponses au questionnaire
                                  </p>
                                  <dl className="grid gap-3 sm:grid-cols-2">
                                    {row.answers.map((answer) => (
                                      <div key={answer.questionId}>
                                        <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                          {answer.label}
                                        </dt>
                                        <dd className="mt-0.5 text-sm font-medium text-slate-800">
                                          {answer.value.length > 0
                                            ? answer.value.join(", ")
                                            : "—"}
                                        </dd>
                                      </div>
                                    ))}
                                  </dl>
                                </div>
                              ) : null}

                              <div className="mt-5 flex flex-wrap items-center gap-2">
                                <Button
                                  disabled={isSaving}
                                  onClick={() =>
                                    void patchReservation(row.id, {
                                      courseId: draft.courseId,
                                      email: draft.email,
                                      fullName: draft.fullName,
                                      message: draft.message,
                                      phone: draft.phone,
                                      profession: draft.profession,
                                      wilaya: draft.wilaya
                                    })
                                  }
                                  size="sm"
                                  type="button"
                                >
                                  {isSaving && (
                                    <Loader className="h-3.5 w-3.5 animate-spin" />
                                  )}
                                  Enregistrer
                                </Button>
                                <Button
                                  onClick={() => {
                                    setDrafts((current) => {
                                      const next = { ...current };
                                      delete next[row.id];
                                      return next;
                                    });
                                  }}
                                  size="sm"
                                  type="button"
                                  variant="outline"
                                >
                                  Réinitialiser
                                </Button>
                                <button
                                  className="dentova-focus ml-auto inline-flex h-8 items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                                  disabled={isSaving || deleteLoading}
                                  onClick={() => setPendingDelete(row)}
                                  type="button"
                                >
                                  <Trash2 className="h-3 w-3" />
                                  Supprimer
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {pages > 1 ? (
          <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
            <p className="text-xs text-slate-400">
              Page {page} sur {pages}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                aria-label="Page précédente"
                className="dentova-focus inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={page <= 1 || loading}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                type="button"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                aria-label="Page suivante"
                className="dentova-focus inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={page >= pages || loading}
                onClick={() => setPage((current) => Math.min(pages, current + 1))}
                type="button"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <ConfirmDialog
        confirmLabel="Supprimer"
        description={
          pendingDelete
            ? `La réservation de ${pendingDelete.fullName} pour « ${pendingDelete.courseTitle} » sera définitivement supprimée.`
            : "Cette action est irréversible."
        }
        loading={deleteLoading}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        open={pendingDelete !== null}
        title="Supprimer cette réservation ?"
      />

      <ConfirmDialog
        confirmLabel="Supprimer"
        description={`${selectedIds.size} réservation(s) seront définitivement supprimées. Cette action est irréversible.`}
        loading={bulkBusy}
        onCancel={() => setConfirmBulkDelete(false)}
        onConfirm={applyBulkDelete}
        open={confirmBulkDelete}
        title="Supprimer la sélection ?"
      />
    </div>
  );
}
