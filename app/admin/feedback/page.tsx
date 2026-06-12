import { AdminHeader } from "@/components/admin/AdminHeader";
import { FeedbackAdminPanel } from "@/components/admin/FeedbackAdminPanel";
import { tryConnectToDatabase } from "@/lib/db/connect";
import { Feedback } from "@/models/Feedback";

export default async function FeedbackPage() {
  let feedback: Array<Record<string, unknown>> = [];

  if (await tryConnectToDatabase()) {
    feedback = await Feedback.find({}).sort({ createdAt: -1 }).lean();
  }

  return (
    <>
      <AdminHeader
        description="Approuvez, modifiez et gérez les avis clients"
        title="Avis clients"
      />
      <FeedbackAdminPanel feedback={feedback as never} />
    </>
  );
}
