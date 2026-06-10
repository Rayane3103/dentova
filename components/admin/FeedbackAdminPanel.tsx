"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { adminBadgeClassName, adminCardClassName } from "@/components/admin/admin-ui";
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
      <Card className={`${adminCardClassName} mt-5 p-5 text-sm text-dentova-muted`}>
        Aucun avis recu pour le moment.
      </Card>
    );
  }

  return (
    <div className="mt-5 space-y-3">
      {items.map((item) => (
        <Card className={`${adminCardClassName} p-4`} key={item._id}>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_200px] lg:items-start">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <p className="font-semibold text-dentova-navy">{item.fullName}</p>
                {item.rating ? (
                  <span className={adminBadgeClassName}>{item.rating}/5</span>
                ) : null}
              </div>
              <p className="text-xs text-dentova-muted">
                {item.email}
                {item.courseName ? ` • ${item.courseName}` : ""}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-dentova-ink">{item.message}</p>
            </div>

            <div className="space-y-2.5 rounded-lg border border-dentova-navy/10 bg-dentova-ice/40 p-3">
              <label className="flex items-center gap-2 text-xs font-semibold text-dentova-navy">
                <Checkbox
                  checked={item.approved}
                  onChange={(event) =>
                    void updateItem(item._id, { approved: event.target.checked })
                  }
                />
                Approuve
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-dentova-navy">
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
                size="sm"
              />
              <Button
                className="w-full"
                onClick={() => void removeItem(item._id)}
                size="sm"
                variant="outline"
              >
                Supprimer
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
