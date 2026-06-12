import { HelpCircle, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { tryConnectToDatabase } from "@/lib/db/connect";
import { serializeFAQ } from "@/lib/data/serialize";
import { FAQ } from "@/models/FAQ";

export default async function AdminFaqsPage() {
  let faqs: ReturnType<typeof serializeFAQ>[] = [];

  if (await tryConnectToDatabase()) {
    const docs = await FAQ.find({}).sort({ sortOrder: 1 }).lean();
    faqs = docs.map((doc) => serializeFAQ(doc as Record<string, unknown>));
  }

  return (
    <>
      <AdminHeader
        actions={
          <Button asChild href="/admin/faqs/new" size="sm">
            <Plus className="h-3.5 w-3.5" />
            Nouvelle question
          </Button>
        }
        description="Gérez la foire aux questions du site"
        title="FAQ"
      />
      <div className="space-y-3">
        {faqs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <HelpCircle className="h-7 w-7 text-slate-400" />
            </div>
            <h3 className="mt-5 text-base font-bold text-slate-800">
              Aucune FAQ
            </h3>
            <p className="mt-1.5 text-sm text-slate-500">
              Ajoutez des questions fréquentes pour aider vos visiteurs.
            </p>
          </div>
        ) : (
          faqs.map((faq) => (
            <div
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              key={faq.id}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-800">
                      {faq.question}
                    </h3>
                    {!faq.published && <StatusBadge variant="draft" />}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-500">
                    {faq.answer}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link
                    className="dentova-focus inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                    href={`/admin/faqs/${faq.id}/edit`}
                  >
                    <Pencil className="mr-1.5 h-3.5 w-3.5" />
                    Modifier
                  </Link>
                  <AdminDeleteButton endpoint={`/api/admin/faqs/${faq.id}`} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
