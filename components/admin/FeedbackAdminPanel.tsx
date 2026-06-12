"use client";

import { Star, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { StatusBadge } from "@/components/admin/StatusBadge";

type FeedbackItem = {
  _id: string;
  approved: boolean;
  courseName?: string;
  email: string;
  fullName: string;
  message: string;
  rating?: number;
  role?: string;
  showOnHomepage: boolean;
};

export function FeedbackAdminPanel({ feedback }: { feedback: FeedbackItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState(feedback);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const updateItem = async (
    id: string,
    patch: Partial<Pick<FeedbackItem, "approved" | "showOnHomepage" | "role">>
  ) => {
    const response = await fetch("/api/admin/feedback", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch })
    });
    if (!response.ok) {
      toast.error("Mise à jour impossible.");
      return;
    }
    const data = (await response.json()) as { feedback: FeedbackItem };
    const updated = data.feedback;
    setItems((current) =>
      current.map((item) =>
        item._id === id
          ? {
              ...item,
              approved: updated.approved,
              showOnHomepage: updated.showOnHomepage,
              role: updated.role ?? item.role
            }
          : item
      )
    );
    toast.success("Avis mis à jour.");
    router.refresh();
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    const response = await fetch("/api/admin/feedback", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deleteId })
    });
    if (!response.ok) {
      toast.error("Suppression impossible.");
      setDeleteLoading(false);
      return;
    }
    setItems((current) => current.filter((item) => item._id !== deleteId));
    toast.success("Avis supprimé.");
    router.refresh();
    setDeleteLoading(false);
    setDeleteId(null);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
          <Star className="h-7 w-7 text-slate-400" />
        </div>
        <h3 className="mt-5 text-base font-bold text-slate-800">
          Aucun avis
        </h3>
        <p className="mt-1.5 text-sm text-slate-500">
          Les avis clients apparaîtront ici.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            key={item._id}
          >
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-start">
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-800">
                    {item.fullName}
                  </h3>
                  {item.rating && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700 ring-1 ring-amber-200">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {item.rating}/5
                    </span>
                  )}
                  <StatusBadge
                    variant={item.approved ? "confirmed" : "pending"}
                    label={item.approved ? "Approuvé" : "En attente"}
                  />
                </div>
                <p className="text-xs text-slate-400">
                  {item.email}
                  {item.courseName ? ` • ${item.courseName}` : ""}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.message}
                </p>
              </div>

              {/* Actions panel */}
              <div className="space-y-3 rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                  <Checkbox
                    checked={item.approved}
                    onChange={(event) =>
                      void updateItem(item._id, { approved: event.target.checked })
                    }
                  />
                  Approuvé
                </label>
                <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                  <Checkbox
                    checked={item.showOnHomepage}
                    onChange={(event) =>
                      void updateItem(item._id, { showOnHomepage: event.target.checked })
                    }
                  />
                  Afficher sur l&apos;accueil
                </label>
                <Input
                  defaultValue={item.role || "Participant"}
                  onBlur={(event) =>
                    void updateItem(item._id, { role: event.target.value })
                  }
                  placeholder="Rôle affiché"
                  size="sm"
                />
                <button
                  className="dentova-focus flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                  onClick={() => setDeleteId(item._id)}
                  type="button"
                >
                  <Trash2 className="h-3 w-3" />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        confirmLabel="Supprimer"
        description="Cet avis sera définitivement supprimé."
        loading={deleteLoading}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        open={deleteId !== null}
        title="Supprimer cet avis ?"
      />
    </>
  );
}
