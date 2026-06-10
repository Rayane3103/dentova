"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";

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
      toast.error("Mise a jour impossible.");
      return;
    }

    setItems((current) =>
      current.map((item) => (item._id === id ? { ...item, ...patch } : item))
    );
    toast.success("Avis mis a jour.");
    router.refresh();
  };

  const removeItem = async (id: string) => {
    const response = await fetch("/api/admin/feedback", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });

    if (!response.ok) {
      toast.error("Suppression impossible.");
      return;
    }

    setItems((current) => current.filter((item) => item._id !== id));
    toast.success("Avis supprime.");
    router.refresh();
  };

  if (items.length === 0) {
    return (
      <Card className="mt-8 p-6 text-dentova-muted">
        Aucun avis recu pour le moment.
      </Card>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      {items.map((item) => (
        <Card className="p-5" key={item._id}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-bold text-dentova-navy">{item.fullName}</p>
              <p className="text-sm text-dentova-muted">
                {item.email} {item.courseName ? `• ${item.courseName}` : ""}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-dentova-ink">{item.message}</p>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold">
                <Checkbox
                  checked={item.approved}
                  onChange={(event) =>
                    void updateItem(item._id, { approved: event.target.checked })
                  }
                />
                Approuve
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold">
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
                placeholder="Role affiche"
              />
              <Button onClick={() => void removeItem(item._id)} size="sm" variant="outline">
                Supprimer
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
