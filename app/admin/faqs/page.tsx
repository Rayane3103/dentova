import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminShell } from "@/components/admin/AdminShell";
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <AdminHeader title="FAQ" />
        <Button asChild href="/admin/faqs/new">
          Nouvelle question
        </Button>
      </div>
      <div className="mt-8 space-y-4">
        {faqs.length === 0 ? (
          <Card className="p-6 text-dentova-muted">Aucune FAQ creee.</Card>
        ) : (
          faqs.map((faq) => (
            <Card className="p-5" key={faq.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-dentova-navy">{faq.question}</p>
                  <p className="mt-2 text-sm text-dentova-muted">{faq.answer}</p>
                </div>
                <div className="flex gap-2">
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
