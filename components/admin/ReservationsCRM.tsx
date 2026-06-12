"use client";

import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Loader,
  MapPin,
  Search
} from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import { toast } from "sonner";
import { adminLabelClassName } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/utils";

export type ReservationStatus = "pending" | "confirmed" | "cancelled";

export type ReservationCourse = {
  id: string;
  title: string;
  price: number;
};

export type ReservationRecord = {
  id: string;
  courseId: string;
  courseTitle: string;
  coursePrice?: number;
  createdAt: string;
  email: string;
  fullName: string;
  message?: string;
  phone: string;
  profession?: string;
  status: ReservationStatus;
  updatedAt?: string;
  wilaya: string;
};

const statusOptions = [
  { value: "pending", label: "En attente" },
  { value: "confirmed", label: "Confirmée" },
  { value: "cancelled", label: "Annulée" }
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

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
  initialReservations
}: {
  courses: ReservationCourse[];
  initialReservations: ReservationRecord[];
}) {
  const [rows, setRows] = useState(initialReservations);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | ReservationStatus>("all");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, ReservationRecord>>({});

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesCourse = courseFilter === "all" || row.courseId === courseFilter;
      const matchesStatus = statusFilter === "all" || row.status === statusFilter;
      const matchesSearch =
        !query ||
        row.fullName.toLowerCase().includes(query) ||
        row.phone.toLowerCase().includes(query) ||
        row.email.toLowerCase().includes(query) ||
        row.courseTitle.toLowerCase().includes(query);
      return matchesCourse && matchesStatus && matchesSearch;
    });
  }, [courseFilter, rows, search, statusFilter]);

  const counts = useMemo(
    () => ({
      all: rows.length,
      pending: rows.filter((row) => row.status === "pending").length,
      confirmed: rows.filter((row) => row.status === "confirmed").length,
      cancelled: rows.filter((row) => row.status === "cancelled").length
    }),
    [rows]
  );

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

      const data = (await response.json()) as {
        reservation: Record<string, unknown> & {
          courseId?: Record<string, unknown> | string;
        };
      };
      const course = data.reservation.courseId as Record<string, unknown> | null;
      const existing = rows.find((row) => row.id === id);

      const updated: ReservationRecord = {
        id: String(data.reservation._id),
        courseId: course?._id ? String(course._id) : patch.courseId || existing?.courseId || "",
        courseTitle: course?.title
          ? String(course.title)
          : existing?.courseTitle || "Formation non renseignée",
        coursePrice: course?.price ? Number(course.price) : existing?.coursePrice,
        createdAt: String(data.reservation.createdAt),
        email: String(data.reservation.email),
        fullName: String(data.reservation.fullName),
        message: data.reservation.message ? String(data.reservation.message) : undefined,
        phone: String(data.reservation.phone),
        profession: data.reservation.profession ? String(data.reservation.profession) : undefined,
        status: data.reservation.status as ReservationStatus,
        updatedAt: data.reservation.updatedAt ? String(data.reservation.updatedAt) : undefined,
        wilaya: String(data.reservation.wilaya)
      };

      setRows((current) => current.map((row) => (row.id === id ? updated : row)));
      setDrafts((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });

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
            onChange={(event) => setCourseFilter(event.target.value)}
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
            onChange={(event) =>
              setStatusFilter(event.target.value as "all" | ReservationStatus)
            }
            size="sm"
            value={statusFilter}
          >
            <option value="all">Tous ({counts.all})</option>
            <option value="pending">En attente ({counts.pending})</option>
            <option value="confirmed">Confirmées ({counts.confirmed})</option>
            <option value="cancelled">Annulées ({counts.cancelled})</option>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Liste des réservations</h2>
            <p className="text-xs text-slate-400">
              {filteredRows.length} réservation{filteredRows.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {filteredRows.length === 0 ? (
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
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-[0.06em] text-slate-500">
                  <th className="w-10 px-3 py-3" />
                  <th className="px-3 py-3">Client</th>
                  <th className="px-3 py-3">Contact</th>
                  <th className="px-3 py-3">Formation</th>
                  <th className="px-3 py-3">Prix</th>
                  <th className="px-3 py-3">Statut</th>
                  <th className="px-3 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredRows.map((row) => {
                  const expanded = expandedId === row.id;
                  const draft = getDraft(row);
                  const isSaving = savingId === row.id;

                  return (
                    <Fragment key={row.id}>
                      <tr
                        className={cn(
                          "group transition hover:bg-slate-50/70",
                          expanded && "bg-slate-50/70"
                        )}
                      >
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
                              row.status === "pending" &&
                                "border-amber-200 bg-amber-50 text-amber-700",
                              row.status === "confirmed" &&
                                "border-emerald-200 bg-emerald-50 text-emerald-700",
                              row.status === "cancelled" &&
                                "border-red-200 bg-red-50 text-red-600"
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
                      </tr>

                      {/* Expanded Detail Row */}
                      {expanded && (
                        <tr className="border-b border-slate-100 bg-slate-50/30">
                          <td className="px-3 py-0" colSpan={7}>
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
                                        coursePrice: course?.price ?? draft.coursePrice
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

                              <div className="mt-5 flex flex-wrap gap-2">
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
      </div>
    </div>
  );
}
