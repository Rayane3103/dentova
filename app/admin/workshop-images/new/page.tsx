import { AdminShell } from "@/components/admin/AdminShell";
import { WorkshopImageForm } from "@/components/admin/WorkshopImageForm";

export default function NewWorkshopImagePage() {
  return (
    <AdminShell>
      <h1 className="text-4xl font-extrabold text-dentova-navy">
        Add Workshop Image
      </h1>
      <p className="mt-2 text-xl text-dentova-ink/60">
        Upload or link a new gallery image.
      </p>
      <div className="mt-8">
        <WorkshopImageForm />
      </div>
    </AdminShell>
  );
}
