"use client";

import { Mail, Phone, Trash2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ExportMenu } from "@/components/admin/ExportMenu";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Dropdown, type DropdownOption } from "@/components/ui/Dropdown";
import type { ExportColumn } from "@/lib/export/table-export";
import { cn } from "@/lib/utils";

export type SignupEntry = {
  id: string;
  kind: "general" | "course";
  fullName: string;
  email: string;
  phone: string;
  profession?: string;
  wilaya?: string;
  courseLabel?: string;
  message?: string;
  status: string;
  createdAt?: string;
};

const statusLabels: Record<string, string> = {
  new: "Nouveau",
  contacted: "Contacté",
  archived: "Archivé",
  pending: "En attente",
  confirmed: "Confirmée",
  paid: "Payé",
  cancelled: "Annulée",
  spam: "Spam"
};

/** Signups and reservations carry different status sets on the same list. */
const signupStatusOptions: DropdownOption[] = [
  { value: "new", label: "Nouveau", dotClassName: "bg-blue-500" },
  { value: "contacted", label: "Contacté", dotClassName: "bg-indigo-500" },
  { value: "archived", label: "Archivé", dotClassName: "bg-slate-400" },
  { value: "spam", label: "Spam", dotClassName: "bg-rose-500" }
];

const reservationStatusOptions: DropdownOption[] = [
  { value: "pending", label: "En attente", dotClassName: "bg-amber-400" },
  { value: "confirmed", label: "Confirmée", dotClassName: "bg-emerald-500" },
  { value: "paid", label: "Payé", dotClassName: "bg-sky-500" },
  { value: "cancelled", label: "Annulée", dotClassName: "bg-red-500" },
  { value: "spam", label: "Spam", dotClassName: "bg-rose-500" }
];

const statusTriggerStyles: Record<string, string> = {
  new: "border-blue-200 bg-blue-50 text-blue-700",
  contacted: "border-indigo-200 bg-indigo-50 text-indigo-700",
  archived: "border-slate-200 bg-slate-100 text-slate-500",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  confirmed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  paid: "border-sky-200 bg-sky-50 text-sky-700",
  cancelled: "border-red-200 bg-red-50 text-red-600",
  spam: "border-rose-300 bg-rose-100 text-rose-700"
};

function formatDayOnly(value: string | undefined) {
  if (!value) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(value));
}

const signupExportColumns: ExportColumn<SignupEntry>[] = [
  {
    header: "Type",
    value: (row) => (row.kind === "course" ? "Réservation" : "Inscription"),
    width: 14
  },
  { header: "Nom complet", value: (row) => row.fullName, width: 24 },
  { header: "Email", value: (row) => row.email, width: 26 },
  { header: "Téléphone", value: (row) => row.phone, width: 16 },
  { header: "Profession", value: (row) => row.profession ?? "", width: 18 },
  { header: "Wilaya", value: (row) => row.wilaya ?? "", width: 16 },
  { header: "Formation / Intérêt", value: (row) => row.courseLabel ?? "", width: 28 },
  {
    header: "Statut",
    value: (row) => statusLabels[row.status] ?? row.status,
    width: 14
  },
  { header: "Message", value: (row) => row.message ?? "", width: 32 },
  { header: "Date", value: (row) => formatDayOnly(row.createdAt), width: 16 }
];

type PendingDelete = {
  id: string;
  kind: SignupEntry["kind"];
  fullName: string;
};

export function SignupsList({ initialEntries }: { initialEntries: SignupEntry[] }) {
  const router = useRouter();
  const [entries, setEntries] = useState(initialEntries);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "spam">("all");
  const [savingId, setSavingId] = useState<string | null>(null);

  const spamCount = entries.filter((entry) => entry.status === "spam").length;
  const visibleEntries = entries.filter((entry) => {
    if (statusFilter === "spam") return entry.status === "spam";
    if (statusFilter === "active") return entry.status !== "spam";
    return true;
  });

  const updateStatus = async (entry: SignupEntry, status: string) => {
    const endpoint =
      entry.kind === "course" ? "/api/admin/reservations" : "/api/admin/signups";
    const key = `${entry.kind}-${entry.id}`;
    const previous = entry.status;

    setSavingId(key);
    setEntries((current) =>
      current.map((item) =>
        item.id === entry.id && item.kind === entry.kind ? { ...item, status } : item
      )
    );

    try {
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: entry.id, status })
      });
      if (!response.ok) throw new Error("Status update failed");

      toast.success(`Statut mis à jour : ${statusLabels[status] ?? status}.`);
      router.refresh();
    } catch {
      setEntries((current) =>
        current.map((item) =>
          item.id === entry.id && item.kind === entry.kind
            ? { ...item, status: previous }
            : item
        )
      );
      toast.error("Mise à jour impossible.");
    } finally {
      setSavingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;

    setDeleteLoading(true);
    const endpoint =
      pendingDelete.kind === "course"
        ? `/api/admin/reservations/${pendingDelete.id}`
        : `/api/admin/signups/${pendingDelete.id}`;

    try {
      const response = await fetch(endpoint, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");

      setEntries((current) =>
        current.filter(
          (entry) => !(entry.id === pendingDelete.id && entry.kind === pendingDelete.kind)
        )
      );
      toast.success("Inscription supprimée.");
      router.refresh();
    } catch {
      toast.error("Suppression impossible.");
    } finally {
      setDeleteLoading(false);
      setPendingDelete(null);
    }
  };

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
          <User className="h-7 w-7 text-slate-400" />
        </div>
        <h3 className="mt-5 text-base font-bold text-slate-800">Aucune inscription</h3>
        <p className="mt-1.5 text-sm text-slate-500">Les inscriptions apparaîtront ici.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-3 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-semibold text-slate-500">
          {visibleEntries.length} inscription{visibleEntries.length !== 1 ? "s" : ""}
          {statusFilter !== "all" ? ` sur ${entries.length}` : ""}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Dropdown
            aria-label="Filtrer les inscriptions"
            className="w-full sm:w-48"
            onChange={(next) => setStatusFilter(next as "all" | "active" | "spam")}
            options={[
              { value: "all", label: "Toutes", hint: `(${entries.length})` },
              {
                value: "active",
                label: "Hors spam",
                hint: `(${entries.length - spamCount})`
              },
              {
                value: "spam",
                label: "Spam uniquement",
                hint: `(${spamCount})`,
                dotClassName: "bg-rose-500"
              }
            ]}
            size="sm"
            value={statusFilter}
          />
          <ExportMenu
            columns={signupExportColumns}
            filename="dentova-inscriptions"
            rows={visibleEntries}
            title="Inscriptions"
          />
        </div>
      </div>
      <div className="space-y-3">
        {visibleEntries.map((entry) => (
          <div
            className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
            key={`${entry.kind}-${entry.id}`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <StatusBadge
                    variant={entry.kind === "course" ? "confirmed" : "new"}
                    label={entry.kind === "course" ? "Réservation" : "Inscription"}
                  />
                  <span className="text-sm font-bold text-slate-800">{entry.fullName}</span>
                </div>
                <div className="mb-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {entry.email}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {entry.phone}
                  </span>
                </div>
                {(entry.profession || entry.wilaya) && (
                  <p className="text-xs text-slate-500">
                    {[entry.profession, entry.wilaya].filter(Boolean).join(" • ")}
                  </p>
                )}
                {entry.courseLabel && (
                  <p className="mt-1 text-xs font-medium text-dentova-navy">{entry.courseLabel}</p>
                )}
                {entry.message && (
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{entry.message}</p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
                <div className="flex items-center gap-2">
                  <Dropdown
                    aria-label={`Statut de ${entry.fullName}`}
                    disabled={savingId === `${entry.kind}-${entry.id}`}
                    onChange={(next) => void updateStatus(entry, next)}
                    options={
                      entry.kind === "course"
                        ? reservationStatusOptions
                        : signupStatusOptions
                    }
                    size="sm"
                    tone="bare"
                    triggerClassName={cn(
                      "h-8 min-w-[124px] border px-2.5 text-xs font-bold uppercase tracking-wide",
                      statusTriggerStyles[entry.status] ??
                        "border-slate-200 bg-slate-100 text-slate-500"
                    )}
                    value={entry.status}
                  />
                  {entry.createdAt && (
                    <span className="text-xs text-slate-400">
                      {new Date(entry.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short"
                      })}
                    </span>
                  )}
                </div>
                <button
                  aria-label={`Supprimer ${entry.fullName}`}
                  className={cn(
                    "dentova-focus inline-flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-slate-400 transition",
                    "opacity-100 sm:opacity-0 sm:group-hover:opacity-100",
                    "hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                  )}
                  onClick={() =>
                    setPendingDelete({
                      id: entry.id,
                      kind: entry.kind,
                      fullName: entry.fullName
                    })
                  }
                  title="Supprimer"
                  type="button"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        confirmLabel="Supprimer"
        description={
          pendingDelete
            ? `L'inscription de ${pendingDelete.fullName} sera définitivement supprimée. Cette action est irréversible.`
            : "Cette action est irréversible."
        }
        loading={deleteLoading}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        open={pendingDelete !== null}
        title="Supprimer cette inscription ?"
      />
    </>
  );
}
