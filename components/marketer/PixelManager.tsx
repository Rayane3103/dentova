"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  BadgeCheck,
  CheckCircle,
  ExternalLink,
  Loader,
  Pencil,
  Plus,
  Power,
  PowerOff,
  ShieldAlert,
  Trash,
  X,
  XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { pixelSchema } from "@/lib/validators/marketer";
import { cn } from "@/lib/utils";
import type { Pixel } from "@/types";

type PixelFormValues = z.infer<typeof pixelSchema>;

const PLATFORM_BADGES: Record<string, string> = {
  meta: "bg-blue-50 text-blue-700 border-blue-200",
  tiktok: "bg-slate-900 text-white border-slate-800"
};

const PLATFORM_DOCS: Record<string, string> = {
  meta: "https://www.facebook.com/business/help/952192354843755",
  tiktok: "https://ads.tiktok.com/help/article/install-tiktok-pixel"
};

async function fetchPixels() {
  const res = await fetch("/api/marketer/pixels", {
    credentials: "same-origin"
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || "Erreur lors du chargement des pixels.");
  }
  const data = await res.json();
  return data.pixels as Pixel[];
}

export function PixelManager() {
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  const loadPixels = async () => {
    try {
      setError(null);
      const data = await fetchPixels();
      setPixels(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPixels();
  }, []);

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    watch
  } = useForm<PixelFormValues>({
    resolver: zodResolver(pixelSchema),
    defaultValues: {
      platform: "meta",
      pixelId: "",
      label: "",
      active: false,
      notes: ""
    }
  });

  const selectedPlatform = watch("platform");

  const startCreate = () => {
    reset({
      platform: "meta",
      pixelId: "",
      label: "",
      active: false,
      notes: ""
    });
    setEditingId(null);
    setShowForm(true);
  };

  const startEdit = (pixel: Pixel) => {
    reset({
      platform: pixel.platform,
      pixelId: pixel.pixelId,
      label: pixel.label || "",
      active: pixel.active,
      notes: pixel.notes || ""
    });
    setEditingId(pixel.id);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    reset();
  };

  const onSubmit = async (values: PixelFormValues) => {
    setSaving(true);
    try {
      const url = editingId
        ? `/api/marketer/pixels/${editingId}`
        : "/api/marketer/pixels";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(values)
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Erreur lors de l'enregistrement.");
      }

      toast.success(
        editingId
          ? "Pixel mis à jour avec succès."
          : "Pixel ajouté avec succès."
      );
      cancelForm();
      await loadPixels();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erreur inconnue."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (pixel: Pixel) => {
    setToggling(pixel.id);
    try {
      const res = await fetch(`/api/marketer/pixels/${pixel.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ active: !pixel.active })
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Erreur lors de la mise à jour.");
      }

      toast.success(
        pixel.active
          ? "Pixel désactivé. Il ne sera plus injecté sur le site."
          : "Pixel activé et vérifié. Il sera injecté sur toutes les pages publiques."
      );
      await loadPixels();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erreur inconnue."
      );
    } finally {
      setToggling(null);
    }
  };

  const handleDelete = async (pixel: Pixel) => {
    if (
      !confirm(
        `Supprimer définitivement le pixel ${pixel.platform.toUpperCase()} "${pixel.pixelId}" ? Cette action est irréversible.`
      )
    ) {
      return;
    }

    setDeleting(pixel.id);
    try {
      const res = await fetch(`/api/marketer/pixels/${pixel.id}`, {
        method: "DELETE",
        credentials: "same-origin"
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Erreur lors de la suppression.");
      }

      toast.success("Pixel supprimé définitivement.");
      await loadPixels();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erreur inconnue."
      );
    } finally {
      setDeleting(null);
    }
  };

  const markAsVerified = async (pixel: Pixel) => {
    setToggling(pixel.id);
    try {
      const res = await fetch(`/api/marketer/pixels/${pixel.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ active: true })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Erreur lors de la vérification.");
      }

      toast.success("Pixel vérifié et activé.");
      await loadPixels();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erreur inconnue."
      );
    } finally {
      setToggling(null);
    }
  };

  // ── Loading State ──────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="h-6 w-6 animate-spin text-dentova-navy" />
      </div>
    );
  }

  // ── Error State ────────────────────────────────────
  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <ShieldAlert className="mx-auto h-10 w-10 text-red-400" />
        <p className="mt-3 text-sm font-semibold text-red-700">
          Impossible de charger les pixels
        </p>
        <p className="mt-1 text-xs text-red-500">{error}</p>
        <Button
          className="mt-4"
          onClick={loadPixels}
          size="sm"
          variant="outline"
        >
          Réessayer
        </Button>
      </div>
    );
  }

  const existingPlatforms = pixels.map((p) => p.platform);

  // ── Main render ────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header + Add button */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
            {pixels.length} pixel{pixels.length !== 1 ? "s" : ""} configuré
            {pixels.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          disabled={
            showForm || existingPlatforms.length >= 2
          }
          onClick={startCreate}
          size="sm"
          variant="primary"
        >
          <Plus className="h-4 w-4" />
          Ajouter un pixel
        </Button>
      </div>

      {/* Pixel Cards */}
      {pixels.length === 0 && !showForm && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Radio className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-sm font-bold text-slate-700">
            Aucun pixel configuré
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Ajoutez un pixel Meta ou TikTok pour commencer à suivre les
            visites et les conversions sur votre site.
          </p>
          <Button
            className="mt-6"
            onClick={startCreate}
            size="sm"
            variant="primary"
          >
            <Plus className="h-4 w-4" />
            Configurer mon premier pixel
          </Button>
        </div>
      )}

      <div className="grid gap-4">
        {pixels.map((pixel) => (
          <div
            key={pixel.id}
            className={cn(
              "rounded-2xl border bg-white p-6 shadow-sm transition-all",
              pixel.active
                ? "border-dentova-teal-200 ring-1 ring-dentova-teal-100"
                : "border-slate-200"
            )}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Left: Platform + ID + Status */}
              <div className="flex items-start gap-4">
                {/* Platform badge */}
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold uppercase",
                    PLATFORM_BADGES[pixel.platform]
                  )}
                >
                  {pixel.platform === "meta" ? "Meta" : "TikTok"}
                </span>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-800 font-mono tracking-tight">
                      {pixel.pixelId}
                    </p>
                    {pixel.active && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        <CheckCircle className="h-3 w-3" />
                        Actif
                      </span>
                    )}
                    {!pixel.active && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                        <XCircle className="h-3 w-3" />
                        Inactif
                      </span>
                    )}
                  </div>

                  {pixel.label && (
                    <p className="mt-0.5 text-xs text-slate-400">
                      {pixel.label}
                    </p>
                  )}

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    {pixel.verifiedAt && (
                      <span className="inline-flex items-center gap-1">
                        <BadgeCheck className="h-3 w-3 text-dentova-teal-500" />
                        Vérifié le{" "}
                        {new Date(pixel.verifiedAt).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          }
                        )}
                      </span>
                    )}
                    <span>
                      Créé le{" "}
                      {new Date(pixel.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </span>
                  </div>

                  {pixel.notes && (
                    <p className="mt-2 text-xs text-slate-500 italic">
                      &ldquo;{pixel.notes}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                {/* Toggle */}
                <button
                  className={cn(
                    "dentova-focus inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-all",
                    pixel.active
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  )}
                  disabled={toggling === pixel.id}
                  onClick={() => handleToggle(pixel)}
                  title={
                    pixel.active
                      ? "Désactiver le pixel"
                      : "Activer le pixel"
                  }
                  type="button"
                >
                  {toggling === pixel.id ? (
                    <Loader className="h-3.5 w-3.5 animate-spin" />
                  ) : pixel.active ? (
                    <PowerOff className="h-3.5 w-3.5" />
                  ) : (
                    <Power className="h-3.5 w-3.5" />
                  )}
                  {pixel.active ? "Désactiver" : "Activer"}
                </button>

                {/* Verify (only if inactive) */}
                {!pixel.active && !pixel.verifiedAt && (
                  <button
                    className="dentova-focus inline-flex h-9 items-center gap-1.5 rounded-lg border border-dentova-teal-200 bg-dentova-teal-50 px-3 text-xs font-semibold text-dentova-teal-700 transition hover:bg-dentova-teal-100"
                    disabled={toggling === pixel.id}
                    onClick={() => markAsVerified(pixel)}
                    title="Vérifier et activer ce pixel"
                    type="button"
                  >
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Vérifier
                  </button>
                )}

                {/* Edit */}
                <button
                  className="dentova-focus inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100"
                  disabled={showForm}
                  onClick={() => startEdit(pixel)}
                  title="Modifier le pixel"
                  type="button"
                >
                  <Pencil className="h-4 w-4" />
                </button>

                {/* Delete */}
                <button
                  className="dentova-focus inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-500 transition hover:bg-red-50"
                  disabled={deleting === pixel.id}
                  onClick={() => handleDelete(pixel)}
                  title="Supprimer le pixel"
                  type="button"
                >
                  {deleting === pixel.id ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash className="h-4 w-4" />
                  )}
                </button>

                {/* Docs link */}
                <a
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                  href={PLATFORM_DOCS[pixel.platform]}
                  rel="noopener noreferrer"
                  target="_blank"
                  title={`Documentation pixel ${pixel.platform}`}
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Integration code preview */}
            {pixel.active && (
              <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                  Code injecté sur le site
                </p>
                <pre className="overflow-x-auto text-[11px] leading-relaxed text-slate-600">
                  {pixel.platform === "meta" ? (
                    <code>{`<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function()
{n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixel.pixelId}');
fbq('track', 'PageView');
</script>`}</code>
                  ) : (
                    <code>{`<!-- TikTok Pixel Code -->
<script>
!function(w,d,t){w.TiktokAnalyticsObject=t;
var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify",
"instances","debug","on","off","once","ready","alias","group",
"enableCookie","disableCookie"];
ttq.setAndDefer=function(t,e){t[e]=function()
{t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;
n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";
ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},
ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};
var o=document.createElement("script");o.type="text/javascript",
o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;
var a=document.getElementsByTagName("script")[0];
a.parentNode.insertBefore(o,a)};
ttq.load('${pixel.pixelId}');ttq.page();}(window,document,'ttq');
</script>`}</code>
                  )}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <button
            aria-label="Fermer"
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={cancelForm}
            type="button"
          />

          {/* Dialog */}
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 font-display">
                {editingId
                  ? "Modifier le pixel"
                  : "Ajouter un pixel"}
              </h2>
              <button
                aria-label="Fermer"
                className="dentova-focus rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                onClick={cancelForm}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Platform */}
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Plateforme
                </span>
                <select
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm transition focus:border-dentova-navy focus:outline-none focus:ring-2 focus:ring-dentova-navy/20"
                  {...register("platform")}
                  disabled={!!editingId}
                >
                  <option value="meta">
                    Meta (Facebook / Instagram)
                  </option>
                  <option value="tiktok">TikTok</option>
                </select>
              </label>

              {/* Pixel ID */}
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                  ID du pixel
                </span>
                <Input
                  placeholder={
                    selectedPlatform === "meta"
                      ? "Ex: 1234567890123456"
                      : "Ex: ABCDEFGHIJ1234567890"
                  }
                  size="md"
                  {...register("pixelId")}
                />
                {errors.pixelId && (
                  <span className="mt-1 block text-xs font-semibold text-red-600">
                    {errors.pixelId.message}
                  </span>
                )}
                <p className="mt-1 text-xs text-slate-400">
                  {selectedPlatform === "meta"
                    ? "ID numérique à 15-16 chiffres depuis le gestionnaire d'événements Meta."
                    : "ID alphanumérique à 15-24 caractères depuis le centre d'annonces TikTok."}
                </p>
              </label>

              {/* Label */}
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Libellé <span className="font-normal text-slate-400">(optionnel)</span>
                </span>
                <Input
                  placeholder="Ex: Pixel principal — suivi des conversions"
                  size="md"
                  {...register("label")}
                />
              </label>

              {/* Notes */}
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Notes internes <span className="font-normal text-slate-400">(optionnel)</span>
                </span>
                <Input
                  placeholder="Notes pour l'équipe marketing"
                  size="md"
                  {...register("notes")}
                />
              </label>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  onClick={cancelForm}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  Annuler
                </Button>
                <Button
                  disabled={saving}
                  size="sm"
                  type="submit"
                  variant="primary"
                >
                  {saving && (
                    <Loader className="h-4 w-4 animate-spin" />
                  )}
                  {editingId ? "Enregistrer" : "Ajouter"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Helper: Radio icon for empty state */}
    </div>
  );
}

// Small helper for empty state icon
function Radio({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
