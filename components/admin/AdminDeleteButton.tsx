"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { cn } from "@/lib/utils";

export function AdminDeleteButton({
  compact = false,
  confirmMessage = "Cette action est irréversible. Les données seront définitivement supprimées.",
  endpoint,
  label = "Supprimer",
  title = "Confirmer la suppression"
}: {
  compact?: boolean;
  confirmMessage?: string;
  endpoint: string;
  label?: string;
  title?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(endpoint, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      toast.success("Élément supprimé.");
      router.refresh();
    } catch {
      toast.error("Suppression impossible.");
    } finally {
      setLoading(false);
      setDialogOpen(false);
    }
  };

  if (compact) {
    return (
      <>
        <button
          aria-label={label}
          className={cn(
            "dentova-focus inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-500 transition hover:bg-red-50 hover:border-red-300"
          )}
          onClick={() => setDialogOpen(true)}
          title={label}
          type="button"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
        <ConfirmDialog
          confirmLabel="Supprimer"
          description={confirmMessage}
          loading={loading}
          onCancel={() => setDialogOpen(false)}
          onConfirm={handleDelete}
          open={dialogOpen}
          title={title}
        />
      </>
    );
  }

  return (
    <>
      <button
        className="dentova-focus inline-flex h-9 items-center gap-2 rounded-lg border border-red-200 bg-white px-3.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 hover:border-red-300"
        onClick={() => setDialogOpen(true)}
        type="button"
      >
        <Trash2 className="h-3.5 w-3.5" />
        {label}
      </button>
      <ConfirmDialog
        confirmLabel="Supprimer"
        description={confirmMessage}
        loading={loading}
        onCancel={() => setDialogOpen(false)}
        onConfirm={handleDelete}
        open={dialogOpen}
        title={title}
      />
    </>
  );
}
