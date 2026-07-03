import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { serializeSponsor } from "@/lib/data/serialize";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { sponsorSchema } from "@/lib/validators/sponsor";
import { Sponsor } from "@/models/Sponsor";

export const runtime = "nodejs";

export async function GET() {
  if (!hasDatabaseConfig()) {
    return NextResponse.json({ sponsors: [] });
  }

  await connectToDatabase();
  const sponsors = await Sponsor.find({}).sort({ order: 1, name: 1 }).lean();

  return NextResponse.json({
    sponsors: sponsors.map((doc) => serializeSponsor(doc as Record<string, unknown>))
  });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = sponsorSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 });
  }

  if (!hasDatabaseConfig()) {
    return NextResponse.json(
      { error: "MongoDB is required to create sponsors." },
      { status: 503 }
    );
  }

  await connectToDatabase();
  const sponsor = await Sponsor.create(parsed.data);

  revalidatePath("/");

  return NextResponse.json({ sponsor: serializeSponsor(sponsor.toObject()) }, { status: 201 });
}
