"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function AdminDeleteButton({
  compact = false,
  confirmMessage = "Supprimer cet element ?",
  endpoint,
  label = "Supprimer"
}: {
  compact?: boolean;
  confirmMessage?: string;
  endpoint: string;
  label?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(endpoint, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      toast.success("Element supprime.");
      router.refresh();
    } catch {
      toast.error("Suppression impossible.");
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <button
        aria-label={label}
        className={cn(
          "dentova-focus inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
        )}
        disabled={loading}
        onClick={handleDelete}
        title={label}
        type="button"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    );
  }

  return (
    <Button disabled={loading} onClick={handleDelete} size="sm" type="button" variant="outline">
      <Trash2 className="h-3.5 w-3.5" />
      {label}
    </Button>
  );
}
