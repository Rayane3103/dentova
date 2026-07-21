"use client";

import {
  Check,
  ExternalLink,
  Link2,
  Loader,
  RefreshCw,
  Sheet,
  Unlink
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import type { ReservationsSheetLink } from "@/lib/integrations/reservations-sheet";

type ReservationsSheetButtonProps = {
  initialLink: ReservationsSheetLink | null;
  configured: boolean;
};

export function ReservationsSheetButton({
  initialLink,
  configured
}: ReservationsSheetButtonProps) {
  const [link, setLink] = useState<ReservationsSheetLink | null>(initialLink);
  const [action, setAction] = useState<"link" | "sync" | "unlink" | null>(null);
  const [confirmUnlink, setConfirmUnlink] = useState(false);

  const callLink = async (mode: "link" | "sync") => {
    setAction(mode);
    try {
      const response = await fetch("/api/admin/reservations/sheet", {
        method: "POST"
      });
      const data = (await response.json().catch(() => null)) as {
        link?: ReservationsSheetLink;
        error?: string;
      } | null;

      if (!response.ok || !data?.link) {
        toast.error(data?.error ?? "Opération impossible.");
        return;
      }

      setLink(data.link);
      toast.success(
        mode === "link" ? "Feuille Google liée et synchronisée." : "Feuille resynchronisée."
      );
    } catch {
      toast.error("Opération impossible.");
    } finally {
      setAction(null);
    }
  };

  const unlink = async () => {
    setAction("unlink");
    try {
      const response = await fetch("/api/admin/reservations/sheet", {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("unlink failed");
      setLink(null);
      toast.success("Feuille déliée.");
    } catch {
      toast.error("Impossible de délier la feuille.");
    } finally {
      setAction(null);
      setConfirmUnlink(false);
    }
  };

  if (!link) {
    return (
      <button
        className="dentova-focus inline-flex h-9 items-center gap-1.5 rounded-lg bg-dentova-navy px-3.5 text-xs font-bold text-white transition hover:bg-dentova-navy/90 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={action === "link"}
        onClick={() => void callLink("link")}
        title={
          configured
            ? "Créer une feuille Google synchronisée"
            : "Google Sheets doit être configuré"
        }
        type="button"
      >
        {action === "link" ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Link2 className="h-4 w-4" />
        )}
        Lier avec une feuille
      </button>
    );
  }

  return (
    <>
      <div className="inline-flex items-center gap-1.5">
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-700">
          <Check className="h-3.5 w-3.5" />
          Feuille liée
        </span>
        <a
          className="dentova-focus inline-flex h-9 items-center gap-1.5 rounded-lg bg-dentova-navy px-3 text-xs font-bold text-white transition hover:bg-dentova-navy/90"
          href={link.spreadsheetUrl}
          rel="noreferrer"
          target="_blank"
        >
          <Sheet className="h-4 w-4" />
          Ouvrir
          <ExternalLink className="h-3 w-3" />
        </a>
        <button
          aria-label="Resynchroniser"
          className="dentova-focus inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60"
          disabled={action !== null}
          onClick={() => void callLink("sync")}
          title="Resynchroniser maintenant"
          type="button"
        >
          {action === "sync" ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </button>
        <button
          aria-label="Délier la feuille"
          className="dentova-focus inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
          disabled={action !== null}
          onClick={() => setConfirmUnlink(true)}
          title="Délier"
          type="button"
        >
          <Unlink className="h-4 w-4" />
        </button>
      </div>

      <ConfirmDialog
        confirmLabel="Délier"
        description="La synchronisation s'arrêtera. La feuille Google existante ne sera pas supprimée."
        loading={action === "unlink"}
        onCancel={() => setConfirmUnlink(false)}
        onConfirm={unlink}
        open={confirmUnlink}
        title="Délier la feuille Google ?"
      />
    </>
  );
}
