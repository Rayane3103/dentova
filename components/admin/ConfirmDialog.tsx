"use client";

import { AlertTriangle, Loader } from "lucide-react";
import { useEffect, useRef } from "react";

type ConfirmDialogProps = {
  cancelLabel?: string;
  confirmLabel?: string;
  description?: string;
  destructive?: boolean;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
  title: string;
};

export function ConfirmDialog({
  cancelLabel = "Annuler",
  confirmLabel = "Confirmer",
  description,
  destructive = true,
  loading = false,
  onCancel,
  onConfirm,
  open,
  title
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      cancelRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open && !loading) {
        onCancel();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        aria-label="Fermer"
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
        disabled={loading}
        onClick={onCancel}
        type="button"
      />

      {/* Dialog */}
      <div
        className="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95"
        role="alertdialog"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-desc"
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
              destructive
                ? "bg-red-50 text-red-600"
                : "bg-blue-50 text-blue-600"
            }`}
          >
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3
              className="text-sm font-bold text-slate-900"
              id="confirm-title"
            >
              {title}
            </h3>
            {description && (
              <p
                className="mt-1 text-sm leading-relaxed text-slate-500"
                id="confirm-desc"
              >
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2.5">
          <button
            className="dentova-focus inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            disabled={loading}
            onClick={onCancel}
            ref={cancelRef}
            type="button"
          >
            {cancelLabel}
          </button>
          <button
            className={`dentova-focus inline-flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-semibold text-white transition ${
              destructive
                ? "bg-red-600 hover:bg-red-700"
                : "bg-dentova-navy hover:bg-dentova-navy/90"
            } disabled:opacity-60`}
            disabled={loading}
            onClick={onConfirm}
            type="button"
          >
            {loading && <Loader className="h-3.5 w-3.5 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
