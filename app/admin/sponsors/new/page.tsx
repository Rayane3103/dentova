import { AdminHeader } from "@/components/admin/AdminHeader";
import { SponsorForm } from "@/components/admin/SponsorForm";

export default function NewSponsorPage() {
  return (
    <>
      <AdminHeader title="Nouveau sponsor" />
      <div className="mt-5">
        <SponsorForm />
      </div>
    </>
  );
}
