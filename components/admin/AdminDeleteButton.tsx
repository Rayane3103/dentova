"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";

export function AdminDeleteButton({
  confirmMessage = "Supprimer cet element ?",
  endpoint,
  label = "Supprimer"
}: {
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

  return (
    <Button disabled={loading} onClick={handleDelete} size="sm" type="button" variant="outline">
      <Trash2 className="h-4 w-4" />
      {label}
    </Button>
  );
}
