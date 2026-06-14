import { AdminHeader } from "@/components/admin/AdminHeader";
import { FeedbackAdminPanel } from "@/components/admin/FeedbackAdminPanel";
import { tryConnectToDatabase } from "@/lib/db/connect";
import { Feedback } from "@/models/Feedback";

type FeedbackDoc = {
  _id: string;
  approved: boolean;
  courseName?: string;
  email: string;
  fullName: string;
  message: string;
  rating?: number;
  role?: string;
  showOnHomepage: boolean;
};

export default async function FeedbackPage() {
  let feedback: FeedbackDoc[] = [];

  if (await tryConnectToDatabase()) {
    const docs = await Feedback.find({}).sort({ createdAt: -1 }).lean();
    feedback = (docs as Array<Record<string, unknown>>).map((doc) => ({
      _id: String(doc._id),
      approved: Boolean(doc.approved),
      courseName: doc.courseName ? String(doc.courseName) : undefined,
      email: String(doc.email),
      fullName: String(doc.fullName),
      message: String(doc.message),
      rating: doc.rating ? Number(doc.rating) : undefined,
      role: doc.role ? String(doc.role) : undefined,
      showOnHomepage: Boolean(doc.showOnHomepage)
    }));
  }

  return (
    <>
      <AdminHeader
        description="Approuvez, modifiez et gérez les avis clients"
        title="Avis clients"
      />
      <FeedbackAdminPanel feedback={feedback} />
    </>
  );
}
