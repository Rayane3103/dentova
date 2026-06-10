import { AdminShell } from "@/components/admin/AdminShell";
import { WorkshopImageForm } from "@/components/admin/WorkshopImageForm";

export default function EditWorkshopImagePage() {
  return (
    <AdminShell>
      <h1 className="text-4xl font-extrabold text-dentova-navy">
        Edit Workshop Image
      </h1>
      <p className="mt-2 text-xl text-dentova-ink/60">
        Update gallery image metadata and visibility.
      </p>
      <div className="mt-8">
        <WorkshopImageForm />
      </div>
    </AdminShell>
  );
}
