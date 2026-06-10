import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminBadgeClassName, adminCardClassName } from "@/components/admin/admin-ui";
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
      <div className="mt-5 space-y-3">
        {messages.length === 0 ? (
          <Card className={`${adminCardClassName} p-5 text-sm text-dentova-muted`}>
            Aucun message recu.
          </Card>
        ) : (
          messages.map((message) => (
            <Card className={`${adminCardClassName} p-4`} key={String(message._id)}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="font-semibold text-dentova-navy">{String(message.fullName)}</p>
                  <p className="text-xs text-dentova-muted">
                    {String(message.email)} {message.phone ? `• ${String(message.phone)}` : ""}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-dentova-ink">
                    {String(message.message)}
                  </p>
                </div>
                <span className={adminBadgeClassName}>{String(message.status)}</span>
              </div>
            </Card>
          ))
        )}
      </div>
    </AdminShell>
  );
}
