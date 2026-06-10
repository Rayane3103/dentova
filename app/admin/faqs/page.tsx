import { Plus } from "lucide-react";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminBadgeClassName, adminCardClassName } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
    <AdminShell>
      <AdminHeader
        actions={
          <Button asChild href="/admin/faqs/new" size="sm">
            <Plus className="h-3.5 w-3.5" />
            Nouvelle question
          </Button>
        }
        title="FAQ"
      />
      <div className="mt-5 space-y-3">
        {faqs.length === 0 ? (
          <Card className={`${adminCardClassName} p-5 text-sm text-dentova-muted`}>
            Aucune FAQ creee.
          </Card>
        ) : (
          faqs.map((faq) => (
            <Card className={`${adminCardClassName} p-4`} key={faq.id}>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-dentova-navy">{faq.question}</p>
                    {!faq.published ? (
                      <span className={adminBadgeClassName}>Brouillon</span>
                    ) : null}
                  </div>
                  <p className="text-sm leading-relaxed text-dentova-muted">{faq.answer}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button asChild href={`/admin/faqs/${faq.id}/edit`} size="sm" variant="outline">
                    Modifier
                  </Button>
                  <AdminDeleteButton endpoint={`/api/admin/faqs/${faq.id}`} />
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </AdminShell>
  );
}
