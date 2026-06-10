import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { serializeMentor } from "@/lib/data/serialize";
import { mentorSchema } from "@/lib/validators/content";
import { Mentor } from "@/models/Mentor";

export const runtime = "nodejs";

export async function GET() {
  if (!hasDatabaseConfig()) {
    return NextResponse.json({ mentors: [] });
  }

  await connectToDatabase();
  const mentors = await Mentor.find({}).sort({ order: 1 }).lean();

  return NextResponse.json({
    mentors: mentors.map((doc) => serializeMentor(doc as Record<string, unknown>))
  });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = mentorSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 });
  }

  if (!hasDatabaseConfig()) {
    return NextResponse.json({ error: "MongoDB is required." }, { status: 503 });
  }

  await connectToDatabase();
  const mentor = await Mentor.create(parsed.data);
  revalidatePath("/");

  return NextResponse.json({ mentor }, { status: 201 });
}
