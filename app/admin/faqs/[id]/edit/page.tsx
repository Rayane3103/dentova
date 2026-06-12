import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
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
    <>
      <AdminHeader title="Modifier la FAQ" />
      <div className="mt-5">
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
    </>
  );
}
