import { Mail } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { tryConnectToDatabase } from "@/lib/db/connect";
import { NewsletterSubscriber } from "@/models/NewsletterSubscriber";

export default async function NewsletterPage() {
  let subscribers: Array<Record<string, unknown>> = [];

  if (await tryConnectToDatabase()) {
    subscribers = await NewsletterSubscriber.find({}).sort({ createdAt: -1 }).lean();
  }

  return (
    <>
      <AdminHeader
        description="Liste des abonnés à la newsletter"
        title="Newsletter"
      />
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Abonnés</h2>
            <p className="mt-0.5 text-xs text-slate-400">
              {subscribers.length} abonné{subscribers.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        {subscribers.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <Mail className="h-5 w-5 text-slate-400" />
            </div>
            <p className="mt-4 text-sm font-medium text-slate-600">
              Aucun abonné pour le moment.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {subscribers.map((subscriber) => (
              <div
                className="flex items-center gap-3 px-5 py-3 text-sm transition hover:bg-slate-50/70"
                key={String(subscriber._id)}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <span className="font-medium text-slate-700">
                  {String(subscriber.email)}
                </span>
                <span className="ml-auto text-xs text-slate-400">
                  {new Date(String(subscriber.createdAt)).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
