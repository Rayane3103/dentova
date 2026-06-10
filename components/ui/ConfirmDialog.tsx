"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

type ConfirmDialogProps = {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  title,
  description,
  onCancel,
  onConfirm
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-dentova-graphite/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-dentova-graphite/10 bg-white p-6 shadow-luxe">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-1 h-6 w-6 text-dentova-coral" />
          <div>
            <h2 className="text-2xl font-extrabold text-dentova-graphite">{title}</h2>
            <p className="mt-2 text-dentova-muted">{description}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button onClick={onConfirm}>Confirmer</Button>
        </div>
      </div>
    </div>
  );
}
