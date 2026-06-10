import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminCardClassName } from "@/components/admin/admin-ui";
import { Card } from "@/components/ui/Card";
import { tryConnectToDatabase } from "@/lib/db/connect";
import { NewsletterSubscriber } from "@/models/NewsletterSubscriber";

export default async function NewsletterPage() {
  let subscribers: Array<Record<string, unknown>> = [];

  if (await tryConnectToDatabase()) {
    subscribers = await NewsletterSubscriber.find({}).sort({ createdAt: -1 }).lean();
  }

  return (
    <AdminShell>
      <AdminHeader title="Newsletter" />
      <Card className={`${adminCardClassName} mt-5 overflow-hidden p-0`}>
        {subscribers.length === 0 ? (
          <p className="px-4 py-6 text-sm text-dentova-muted">Aucun abonne pour le moment.</p>
        ) : (
          <div className="divide-y divide-dentova-navy/8">
            {subscribers.map((subscriber) => (
              <div
                className="px-4 py-2.5 text-sm text-dentova-navy"
                key={String(subscriber._id)}
              >
                {String(subscriber.email)}
              </div>
            ))}
          </div>
        )}
      </Card>
    </AdminShell>
  );
}
