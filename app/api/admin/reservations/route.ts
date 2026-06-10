import { NextResponse } from "next/server";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
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

  if (!payload?.id || !payload?.status) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 422 });
  }

  if (!hasDatabaseConfig()) {
    return NextResponse.json({ error: "MongoDB is required." }, { status: 503 });
  }

  await connectToDatabase();
  const reservation = await Reservation.findByIdAndUpdate(
    payload.id,
    { status: payload.status },
    { new: true }
  );

  return reservation
    ? NextResponse.json({ reservation })
    : NextResponse.json({ error: "Reservation not found." }, { status: 404 });
}
