"use client";

import { CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

type SuccessDialogProps = {
  title: string;
  description: string;
  onClose: () => void;
};

export function SuccessDialog({ title, description, onClose }: SuccessDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-dentova-graphite/60 px-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative w-full max-w-sm rounded-xl border border-dentova-teal-200/30 bg-white p-6 text-center shadow-luxe"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-dialog-title"
      >
        <button
          aria-label="Fermer"
          className="absolute right-3 top-3 rounded-full p-1 text-dentova-muted transition hover:bg-dentova-ash hover:text-dentova-graphite"
          onClick={onClose}
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-dentova-mint ring-4 ring-dentova-teal-100">
          <CheckCircle2 className="h-7 w-7 text-dentova-teal-600" />
        </div>
        <h2
          className="text-xl font-extrabold text-dentova-graphite"
          id="success-dialog-title"
        >
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-dentova-muted">{description}</p>
        <Button className="mt-5 w-full" onClick={onClose} size="sm">
          Fermer
        </Button>
      </div>
    </div>
  );
}
