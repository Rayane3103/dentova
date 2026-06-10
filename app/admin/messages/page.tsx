import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/Card";
import { tryConnectToDatabase } from "@/lib/db/connect";
import { ContactMessage } from "@/models/ContactMessage";

export default async function MessagesPage() {
  let messages: Array<Record<string, unknown>> = [];

  if (await tryConnectToDatabase()) {
    messages = await ContactMessage.find({}).sort({ createdAt: -1 }).lean();
  }

  return (
    <AdminShell>
      <AdminHeader title="Messages de contact" />
      <div className="mt-8 space-y-4">
        {messages.length === 0 ? (
          <Card className="p-6 text-dentova-muted">Aucun message recu.</Card>
        ) : (
          messages.map((message) => (
            <Card className="p-5" key={String(message._id)}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-dentova-navy">{String(message.fullName)}</p>
                  <p className="text-sm text-dentova-muted">
                    {String(message.email)} {message.phone ? `• ${String(message.phone)}` : ""}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-dentova-ink">
                    {String(message.message)}
                  </p>
                </div>
                <span className="rounded-full bg-dentova-ice px-3 py-1 text-xs font-bold uppercase text-dentova-navy">
                  {String(message.status)}
                </span>
              </div>
            </Card>
          ))
        )}
      </div>
    </AdminShell>
  );
}
