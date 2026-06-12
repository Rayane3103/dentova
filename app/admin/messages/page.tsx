import { Mail, Phone, User } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { tryConnectToDatabase } from "@/lib/db/connect";
import { ContactMessage } from "@/models/ContactMessage";

export default async function MessagesPage() {
  let messages: Array<Record<string, unknown>> = [];

  if (await tryConnectToDatabase()) {
    messages = await ContactMessage.find({}).sort({ createdAt: -1 }).lean();
  }

  return (
    <>
      <AdminHeader
        description="Messages reçus via le formulaire de contact du site"
        title="Messages"
      />
      <div className="space-y-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <Mail className="h-7 w-7 text-slate-400" />
            </div>
            <h3 className="mt-5 text-base font-bold text-slate-800">
              Aucun message
            </h3>
            <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-slate-500">
              Les messages de contact apparaîtront ici.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              key={String(message._id)}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-800">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      {String(message.fullName)}
                    </span>
                    <StatusBadge
                      variant={String(message.status) === "new" ? "new" : "read"}
                    />
                  </div>
                  <div className="mb-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {String(message.email)}
                    </span>
                    {message.phone ? (
                      <span className="inline-flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {String(message.phone)}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {String(message.message)}
                  </p>
                </div>
                <span className="text-xs text-slate-400">
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
          ))
        )}
      </div>
    </>
  );
}
