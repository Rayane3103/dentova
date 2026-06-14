import type { Metadata } from "next";
import { Users } from "lucide-react";
import { MarketerHeader } from "@/components/marketer/MarketerHeader";
import { tryConnectToDatabase } from "@/lib/db/connect";
import { NewsletterSubscriber } from "@/models/NewsletterSubscriber";

export const metadata: Metadata = {
  title: "Abonnés newsletter"
};

export default async function MarketerSubscribersPage() {
  let subscribers: Array<Record<string, unknown>> = [];

  if (await tryConnectToDatabase()) {
    subscribers = await NewsletterSubscriber.find({})
      .sort({ createdAt: -1 })
      .lean();
  }

  return (
    <>
      <MarketerHeader
        description={`${subscribers.length} abonné${subscribers.length !== 1 ? "s" : ""} à la newsletter`}
        icon={Users}
        title="Newsletter"
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Liste des abonnés</h2>
            <p className="mt-0.5 text-xs text-slate-400">
              {subscribers.length} inscrit{subscribers.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {subscribers.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <Users className="h-7 w-7 text-slate-400" />
            </div>
            <p className="mt-4 text-sm font-bold text-slate-700">
              Aucun abonné pour le moment
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Les inscriptions via le formulaire de newsletter apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {subscribers.map((subscriber) => (
              <div
                className="flex items-center gap-4 px-6 py-3.5 transition hover:bg-slate-50/50"
                key={String(subscriber._id)}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-dentova-teal-50">
                  <Users className="h-4 w-4 text-dentova-teal-600" />
                </div>
                <span className="font-medium text-slate-700">
                  {String(subscriber.email)}
                </span>
                <span className="ml-auto text-xs text-slate-400 tabular-nums">
                  {new Date(String(subscriber.createdAt)).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
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
