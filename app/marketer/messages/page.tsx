import type { Metadata } from "next";
import { Mail, Phone, User } from "lucide-react";
import { MarketerHeader } from "@/components/marketer/MarketerHeader";
import { tryConnectToDatabase } from "@/lib/db/connect";
import { ContactMessage } from "@/models/ContactMessage";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Messages"
};

const STATUS_LABELS: Record<string, string> = {
  new: "Nouveau",
  read: "Lu",
  archived: "Archivé"
};

const STATUS_STYLES: Record<string, string> = {
  new: "bg-dentova-magenta/10 text-dentova-magenta border-dentova-magenta/20",
  read: "bg-slate-100 text-slate-500 border-slate-200",
  archived: "bg-slate-50 text-slate-400 border-slate-200"
};

export default async function MarketerMessagesPage() {
  let messages: Array<Record<string, unknown>> = [];

  if (await tryConnectToDatabase()) {
    messages = await ContactMessage.find({}).sort({ createdAt: -1 }).lean();
  }

  const newCount = messages.filter((m) => m.status === "new").length;

  return (
    <>
      <MarketerHeader
        description={`${newCount} message${newCount !== 1 ? "s" : ""} non lu${newCount !== 1 ? "s" : ""}`}
        icon={Mail}
        title="Messages"
      />

      {messages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <Mail className="h-7 w-7 text-slate-400" />
          </div>
          <h3 className="mt-4 text-sm font-bold text-slate-700">
            Aucun message
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Les messages du formulaire de contact apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {messages.map((message) => (
            <div
              key={String(message._id)}
              className={cn(
                "rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md",
                  message.status === "new"
                  ? "border-dentova-magenta/20 ring-1 ring-dentova-magenta/5"
                  : "border-slate-200/80"
              )}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                {/* Left */}
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-800">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      {String(message.fullName)}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                        STATUS_STYLES[String(message.status)] ||
                          STATUS_STYLES.read
                      )}
                    >
                      {STATUS_LABELS[String(message.status)] ||
                        String(message.status)}
                    </span>
                  </div>

                  <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {String(message.email)}
                    </span>
                    {Boolean(message.phone) && (
                      <span className="inline-flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {String(message.phone)}
                      </span>
                    )}
                  </div>

                  <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">
                    {String(message.message)}
                  </p>
                </div>

                {/* Right: date */}
                <span className="shrink-0 text-xs text-slate-400 tabular-nums">
                  {new Date(String(message.createdAt)).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
