import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { adminReservationUpdateSchema } from "@/lib/validators/admin-reservation";
import { Reservation } from "@/models/Reservation";

export const runtime = "nodejs";

export async function GET() {
  if (!hasDatabaseConfig()) {
    return NextResponse.json({ reservations: [] });
  }

  await connectToDatabase();
  const reservations = await Reservation.find({})
    .populate("courseId")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ reservations });
}

export async function PATCH(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = adminReservationUpdateSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 });
  }

  if (!hasDatabaseConfig()) {
    return NextResponse.json({ error: "MongoDB is required." }, { status: 503 });
  }

  const { id, ...fields } = parsed.data;
  const update: Record<string, unknown> = {};

  if (fields.status) update.status = fields.status;
  if (fields.fullName) update.fullName = fields.fullName;
  if (fields.email) update.email = fields.email;
  if (fields.phone) update.phone = fields.phone;
  if (fields.wilaya) update.wilaya = fields.wilaya;
  if (fields.profession !== undefined) update.profession = fields.profession;
  if (fields.message !== undefined) update.message = fields.message;
  if (fields.courseId) update.courseId = fields.courseId;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No valid fields to update." }, { status: 422 });
  }

  await connectToDatabase();
  const reservation = await Reservation.findByIdAndUpdate(id, update, { new: true }).populate(
    "courseId"
  );

  revalidatePath("/admin/reservations");
  revalidatePath("/admin/signups");

  return reservation
    ? NextResponse.json({ reservation })
    : NextResponse.json({ error: "Reservation not found." }, { status: 404 });
}
