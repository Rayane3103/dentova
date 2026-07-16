"use client";

import { Mail, Phone, Trash2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { StatusBadge } from "@/components/admin/StatusBadge";
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
      <div className="space-y-3">
        {entries.map((entry) => (
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
                  <StatusBadge variant={entry.status === "new" ? "new" : "read"} />
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
