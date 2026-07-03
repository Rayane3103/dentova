import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { serializeSponsor } from "@/lib/data/serialize";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { sponsorSchema } from "@/lib/validators/sponsor";
import { Sponsor } from "@/models/Sponsor";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;

  if (!hasDatabaseConfig()) {
    return NextResponse.json({ error: "MongoDB is not configured." }, { status: 503 });
  }

  await connectToDatabase();
  const sponsor = await Sponsor.findById(id).lean();

  return sponsor
    ? NextResponse.json({ sponsor: serializeSponsor(sponsor as Record<string, unknown>) })
    : NextResponse.json({ error: "Sponsor not found." }, { status: 404 });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const payload = await request.json().catch(() => null);
  const parsed = sponsorSchema.partial().safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 });
  }

  if (!hasDatabaseConfig()) {
    return NextResponse.json({ mode: "preview", ok: true }, { status: 202 });
  }

  await connectToDatabase();
  const sponsor = await Sponsor.findByIdAndUpdate(id, parsed.data, {
    new: true
  });

  revalidatePath("/");

  return sponsor
    ? NextResponse.json({ sponsor: serializeSponsor(sponsor.toObject()) })
    : NextResponse.json({ error: "Sponsor not found." }, { status: 404 });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;

  if (!hasDatabaseConfig()) {
    return NextResponse.json({ mode: "preview", ok: true }, { status: 202 });
  }

  await connectToDatabase();
  await Sponsor.findByIdAndDelete(id);

  revalidatePath("/");

  return NextResponse.json({ ok: true });
}
