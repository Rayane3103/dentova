import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { FeedbackAdminPanel } from "@/components/admin/FeedbackAdminPanel";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { Feedback } from "@/models/Feedback";

export default async function FeedbackPage() {
  let feedback: Array<Record<string, unknown>> = [];

  if (hasDatabaseConfig()) {
    await connectToDatabase();
    feedback = await Feedback.find({}).sort({ createdAt: -1 }).lean();
  }

  return (
    <AdminShell>
      <AdminHeader title="Avis clients" />
      <p className="mt-2 text-dentova-muted">
        Approuvez les avis et choisissez ceux a afficher sur la page d&apos;accueil.
      </p>
      <FeedbackAdminPanel feedback={feedback as never} />
    </AdminShell>
  );
}
