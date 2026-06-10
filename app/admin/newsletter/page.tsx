import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/Card";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { NewsletterSubscriber } from "@/models/NewsletterSubscriber";

export default async function NewsletterPage() {
  let subscribers: Array<Record<string, unknown>> = [];

  if (hasDatabaseConfig()) {
    await connectToDatabase();
    subscribers = await NewsletterSubscriber.find({}).sort({ createdAt: -1 }).lean();
  }

  return (
    <AdminShell>
      <AdminHeader title="Newsletter" />
      <Card className="mt-8 overflow-hidden rounded-xl p-6">
        {subscribers.length === 0 ? (
          <p className="text-dentova-muted">Aucun abonne pour le moment.</p>
        ) : (
          <div className="space-y-3">
            {subscribers.map((subscriber) => (
              <div
                className="rounded-lg border border-dentova-navy/10 px-4 py-3 text-sm"
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
