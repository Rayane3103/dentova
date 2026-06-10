import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { mentorSchema } from "@/lib/validators/content";
import { Mentor } from "@/models/Mentor";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const payload = await request.json().catch(() => null);
  const parsed = mentorSchema.partial().safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 });
  }

  if (!hasDatabaseConfig()) {
    return NextResponse.json({ error: "MongoDB is required." }, { status: 503 });
  }

  await connectToDatabase();
  const mentor = await Mentor.findByIdAndUpdate(id, parsed.data, { new: true });
  revalidatePath("/");

  return mentor
    ? NextResponse.json({ mentor })
    : NextResponse.json({ error: "Mentor not found." }, { status: 404 });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;

  if (!hasDatabaseConfig()) {
    return NextResponse.json({ error: "MongoDB is required." }, { status: 503 });
  }

  await connectToDatabase();
  await Mentor.findByIdAndDelete(id);
  revalidatePath("/");

  return NextResponse.json({ ok: true });
}
