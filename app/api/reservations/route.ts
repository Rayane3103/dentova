import { NextResponse } from "next/server";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { reservationSchema } from "@/lib/validators/reservation";
import { Reservation } from "@/models/Reservation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = reservationSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 });
  }

  if (!hasDatabaseConfig()) {
    return NextResponse.json(
      { error: "Le service de reservation n'est pas disponible pour le moment." },
      { status: 503 }
    );
  }

  await connectToDatabase();

  try {
    const reservation = await Reservation.create({
      ...parsed.data,
      status: "pending"
    });

    return NextResponse.json({ reservation }, { status: 201 });
  } catch (error) {
    console.error("[dentova] Reservation create failed:", error);
    return NextResponse.json(
      { error: "Impossible d'enregistrer la reservation pour le moment." },
      { status: 500 }
    );
  }
}
