import { revalidatePath } from "next/cache";
import { after, NextResponse } from "next/server";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { syncReservationsSheet } from "@/lib/integrations/reservations-sheet";
import { Reservation } from "@/models/Reservation";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;

  if (!hasDatabaseConfig()) {
    return NextResponse.json({ error: "MongoDB is required." }, { status: 503 });
  }

  await connectToDatabase();
  const deleted = await Reservation.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json({ error: "Reservation not found." }, { status: 404 });
  }

  revalidatePath("/admin/reservations");
  revalidatePath("/admin/signups");

  after(() => syncReservationsSheet());

  return NextResponse.json({ ok: true });
}
