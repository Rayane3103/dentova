import { revalidatePath } from "next/cache";
import { after, NextResponse } from "next/server";
import {
  buildReservationFilter,
  countsFromAggregate,
  emptyStatusCounts,
  RESERVATIONS_PAGE_SIZE,
  serializeReservationRecord
} from "@/lib/data/reservation-record";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { syncReservationsSheet } from "@/lib/integrations/reservations-sheet";
import { adminReservationUpdateSchema } from "@/lib/validators/admin-reservation";
import { Reservation } from "@/models/Reservation";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!hasDatabaseConfig()) {
    return NextResponse.json({
      reservations: [],
      total: 0,
      page: 1,
      pages: 1,
      counts: emptyStatusCounts()
    });
  }

  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const status = url.searchParams.get("status");
  const courseId = url.searchParams.get("courseId");
  const exportAll = url.searchParams.get("all") === "1";
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const limit = exportAll
    ? 100000
    : Math.min(100, Math.max(5, Number(url.searchParams.get("limit")) || RESERVATIONS_PAGE_SIZE));

  const filter = buildReservationFilter({ q, status, courseId });

  // Status counts ignore the status filter so the tab totals stay stable.
  const countFilter = { ...filter };
  delete countFilter.status;

  await connectToDatabase();

  const [docs, total, aggregate] = await Promise.all([
    Reservation.find(filter)
      .populate("courseId")
      .sort({ createdAt: -1 })
      .skip(exportAll ? 0 : (page - 1) * limit)
      .limit(limit)
      .lean(),
    Reservation.countDocuments(filter),
    Reservation.aggregate<{ _id: string; count: number }>([
      { $match: countFilter },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ])
  ]);

  return NextResponse.json({
    reservations: docs.map((doc) =>
      serializeReservationRecord(doc as Record<string, unknown>)
    ),
    total,
    page,
    pages: Math.max(1, Math.ceil(total / limit)),
    counts: countsFromAggregate(aggregate)
  });
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

  if (reservation) {
    after(() => syncReservationsSheet());
  }

  return reservation
    ? NextResponse.json({ reservation })
    : NextResponse.json({ error: "Reservation not found." }, { status: 404 });
}
