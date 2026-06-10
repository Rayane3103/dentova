import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { FeedbackAdminPanel } from "@/components/admin/FeedbackAdminPanel";
import { tryConnectToDatabase } from "@/lib/db/connect";
import { Feedback } from "@/models/Feedback";

export default async function FeedbackPage() {
  let feedback: Array<Record<string, unknown>> = [];

  if (await tryConnectToDatabase()) {
    feedback = await Feedback.find({}).sort({ createdAt: -1 }).lean();
  }

  return (
    <AdminShell>
      <AdminHeader
        description="Approuvez les avis et choisissez ceux a afficher sur la page d'accueil."
        title="Avis clients"
      />
      <FeedbackAdminPanel feedback={feedback as never} />
    </AdminShell>
  );
}
