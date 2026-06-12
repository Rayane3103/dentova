import { AdminHeader } from "@/components/admin/AdminHeader";
import { WorkshopImageForm } from "@/components/admin/WorkshopImageForm";

export default function NewWorkshopImagePage() {
  return (
    <>
      <AdminHeader title="Nouvelle image" />
      <div className="mt-5">
        <WorkshopImageForm />
      </div>
    </>
  );
}
