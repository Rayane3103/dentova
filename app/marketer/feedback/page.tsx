import type { Metadata } from "next";
import { Star, MessageSquare, User, Mail } from "lucide-react";
import { MarketerHeader } from "@/components/marketer/MarketerHeader";
import { tryConnectToDatabase } from "@/lib/db/connect";
import { Feedback } from "@/models/Feedback";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Avis clients"
};

export default async function MarketerFeedbackPage() {
  let feedback: Array<Record<string, unknown>> = [];

  if (await tryConnectToDatabase()) {
    feedback = await Feedback.find({}).sort({ createdAt: -1 }).lean();
  }

  const approved = feedback.filter((f) => Boolean(f.approved)).length;
  const pending = feedback.filter((f) => !Boolean(f.approved)).length;

  return (
    <>
      <MarketerHeader
        description="Avis et témoignages laissés par les participants"
        icon={Star}
        title="Avis clients"
      />

      {/* Stats mini-cards */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/40 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-emerald-600">
            Approuvés
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-800">
            {approved}
          </p>
        </div>
        <div className="rounded-xl border border-amber-200/60 bg-amber-50/40 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-amber-600">
            En attente de modération
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-amber-800">
            {pending}
          </p>
        </div>
      </div>

      {feedback.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center">
          <Star className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-sm font-bold text-slate-700">
            Aucun avis pour le moment
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Les avis laissés par les participants apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {feedback.map((item) => {
            const isApproved = Boolean(item.approved);
            const rating = item.rating ? Number(item.rating) : 0;

            return (
              <div
                key={String(item._id)}
                className={cn(
                  "rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md",
                  isApproved
                    ? "border-slate-200"
                    : "border-amber-200/60 ring-1 ring-amber-100/50"
                )}
              >
                {/* Header */}
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                      <User className="h-4 w-4 text-slate-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">
                        {String(item.fullName)}
                      </p>
                      {Boolean(item.role) && (
                        <p className="text-xs text-slate-400 truncate">
                          {String(item.role)}
                        </p>
                      )}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                      isApproved
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-amber-200 bg-amber-50 text-amber-700"
                    )}
                  >
                    {isApproved ? "Approuvé" : "En attente"}
                  </span>
                </div>

                {/* Rating */}
                {rating > 0 && (
                  <div className="mb-2 flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-3.5 w-3.5",
                          i < rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-slate-200 text-slate-200"
                        )}
                      />
                    ))}
                  </div>
                )}

                {/* Message */}
                <p className="text-sm leading-relaxed text-slate-600 line-clamp-4">
                  {String(item.message)}
                </p>

                {/* Footer */}
                <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
                  {Boolean(item.email) && (
                    <span className="inline-flex items-center gap-1 truncate">
                      <Mail className="h-3 w-3 shrink-0" />
                      <span className="truncate">{String(item.email)}</span>
                    </span>
                  )}
                  {Boolean(item.courseName) && (
                    <span className="inline-flex items-center gap-1 truncate">
                      <MessageSquare className="h-3 w-3 shrink-0" />
                      <span className="truncate">{String(item.courseName)}</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
