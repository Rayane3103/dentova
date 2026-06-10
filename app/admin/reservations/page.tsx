import { EmptyAdminState } from "@/components/admin/EmptyAdminState";

export default function ReservationsPage() {
  return (
    <EmptyAdminState
      description="Reservation submissions will appear here once the MongoDB persistence route is connected."
      title="Reservations"
    />
  );
}
