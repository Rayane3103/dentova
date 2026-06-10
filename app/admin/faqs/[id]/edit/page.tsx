import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { FAQForm } from "@/components/admin/FAQForm";
import { tryConnectToDatabase } from "@/lib/db/connect";
import { FAQ } from "@/models/FAQ";

type EditFaqPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditFaqPage({ params }: EditFaqPageProps) {
  const { id } = await params;

  if (!(await tryConnectToDatabase())) {
    notFound();
  }

  const faq = (await FAQ.findById(id).lean()) as Record<string, unknown> | null;

  if (!faq) {
    notFound();
  }

  return (
    <AdminShell>
      <h1 className="text-4xl font-extrabold text-dentova-navy">Modifier la FAQ</h1>
      <div className="mt-8">
        <FAQForm
          faqId={id}
          initialValues={{
            answer: String(faq.answer),
            category: String(faq.category),
            published: Boolean(faq.published),
            question: String(faq.question),
            sortOrder: Number(faq.sortOrder ?? 0)
          }}
        />
      </div>
    </AdminShell>
  );
}
