import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { WorkshopImageForm } from "@/components/admin/WorkshopImageForm";

export default function NewWorkshopImagePage() {
  return (
    <AdminShell>
      <AdminHeader title="Nouvelle image de galerie" />
      <div className="mt-5">
        <WorkshopImageForm />
      </div>
    </AdminShell>
  );
}
