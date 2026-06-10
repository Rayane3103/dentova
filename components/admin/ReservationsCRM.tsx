"use client";

import { ChevronDown, ChevronRight, Loader, Search } from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import { toast } from "sonner";
import { adminCardClassName, adminLabelClassName } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/utils";

export type ReservationStatus = "pending" | "confirmed" | "cancelled";

export type ReservationCourse = {
  id: string;
  title: string;
};

export type ReservationRecord = {
  id: string;
  courseId: string;
  courseTitle: string;
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

const statusLabels: Record<ReservationStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmee",
  cancelled: "Annulee"
};

const statusStyles: Record<ReservationStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  confirmed: "border-emerald-200 bg-emerald-50 text-emerald-800",
  cancelled: "border-red-200 bg-red-50 text-red-700"
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

      if (!response.ok) {
        throw new Error("Update failed");
      }

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
          : existing?.courseTitle || "Formation non renseignee",
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

      if (!options?.silent) {
        toast.success("Reservation mise a jour.");
      }
    } catch {
      toast.error("Mise a jour impossible.");
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
    <div className="mt-5 space-y-4">
      <div className={`${adminCardClassName} p-4`}>
        <div className="grid gap-3 lg:grid-cols-[1fr_220px_180px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dentova-muted" />
            <Input
              className="pl-9"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher par nom, telephone, email..."
              size="sm"
              value={search}
            />
          </label>

          <label className="block">
            <span className={adminLabelClassName}>Formation</span>
            <Select
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
          </label>

          <label className="block">
            <span className={adminLabelClassName}>Statut</span>
            <Select
              onChange={(event) =>
                setStatusFilter(event.target.value as "all" | ReservationStatus)
              }
              size="sm"
              value={statusFilter}
            >
              <option value="all">Tous ({counts.all})</option>
              <option value="pending">En attente ({counts.pending})</option>
              <option value="confirmed">Confirmees ({counts.confirmed})</option>
              <option value="cancelled">Annulees ({counts.cancelled})</option>
            </Select>
          </label>
        </div>
      </div>

      <div className={`${adminCardClassName} overflow-hidden`}>
        <div className="flex items-center justify-between border-b border-dentova-navy/10 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-dentova-navy">Liste des reservations</p>
            <p className="text-xs text-dentova-muted">
              {filteredRows.length} reservation{filteredRows.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {filteredRows.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-dentova-muted">
            Aucune reservation ne correspond a vos filtres.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-dentova-navy/10 bg-[#f8f9fc] text-[11px] font-bold uppercase tracking-wide text-dentova-muted">
                  <th className="w-10 px-3 py-2.5" />
                  <th className="px-3 py-2.5">Participant</th>
                  <th className="px-3 py-2.5">Telephone</th>
                  <th className="px-3 py-2.5">Formation</th>
                  <th className="px-3 py-2.5">Statut</th>
                  <th className="px-3 py-2.5">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => {
                  const expanded = expandedId === row.id;
                  const draft = getDraft(row);
                  const isSaving = savingId === row.id;

                  return (
                    <Fragment key={row.id}>
                      <tr
                        className={cn(
                          "border-b border-dentova-navy/8 transition hover:bg-dentova-ice/40",
                          expanded && "bg-dentova-ice/30"
                        )}
                      >
                        <td className="px-3 py-2.5">
                          <button
                            aria-expanded={expanded}
                            aria-label={expanded ? "Replier" : "Developper"}
                            className="dentova-focus inline-flex h-7 w-7 items-center justify-center rounded-md border border-dentova-navy/10 text-dentova-navy transition hover:bg-white"
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
                        <td className="px-3 py-2.5">
                          <p className="font-semibold text-dentova-navy">{row.fullName}</p>
                          <p className="text-xs text-dentova-muted">{row.email}</p>
                        </td>
                        <td className="px-3 py-2.5 font-medium text-dentova-ink">{row.phone}</td>
                        <td className="px-3 py-2.5">
                          <p className="max-w-[240px] truncate text-dentova-ink">{row.courseTitle}</p>
                        </td>
                        <td className="px-3 py-2.5">
                          <select
                            className={cn(
                              "dentova-focus h-8 min-w-[130px] rounded-md border px-2 text-xs font-semibold capitalize",
                              statusStyles[row.status]
                            )}
                            disabled={isSaving}
                            onChange={(event) =>
                              void patchReservation(row.id, {
                                status: event.target.value as ReservationStatus
                              })
                            }
                            value={row.status}
                          >
                            {Object.entries(statusLabels).map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-2.5 text-xs text-dentova-muted">
                          {formatDate(row.createdAt)}
                        </td>
                      </tr>

                      {expanded ? (
                        <tr className="border-b border-dentova-navy/8 bg-[#fbfcfe]">
                          <td className="px-3 py-0" colSpan={6}>
                            <div className="py-4 pl-10 pr-3">
                              <div className="mb-4 flex items-center justify-between gap-3">
                                <div>
                                  <p className="text-sm font-semibold text-dentova-navy">
                                    Details de la reservation
                                  </p>
                                  <p className="text-xs text-dentova-muted">
                                    Modifiez les informations puis enregistrez.
                                  </p>
                                </div>
                                {row.updatedAt ? (
                                  <p className="text-xs text-dentova-muted">
                                    Derniere mise a jour: {formatDate(row.updatedAt)}
                                  </p>
                                ) : null}
                              </div>

                              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
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
                                  <span className={adminLabelClassName}>Telephone</span>
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
                                        courseTitle: course?.title || draft.courseTitle
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
                                <label className="block md:col-span-2 xl:col-span-3">
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

                              <div className="mt-4 flex flex-wrap gap-2">
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
                                  {isSaving ? (
                                    <Loader className="h-3.5 w-3.5 animate-spin" />
                                  ) : null}
                                  Enregistrer les modifications
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
                                  Reinitialiser
                                </Button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : null}
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
