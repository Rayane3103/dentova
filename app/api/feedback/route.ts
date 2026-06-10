import { NextResponse } from "next/server";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { feedbackSchema } from "@/lib/validators/feedback";
import { Feedback } from "@/models/Feedback";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = feedbackSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 });
  }

  if (!hasDatabaseConfig()) {
    return NextResponse.json({ mode: "preview", ok: true }, { status: 202 });
  }

  await connectToDatabase();
  const feedback = await Feedback.create({ ...parsed.data, approved: false });

  return NextResponse.json({ feedback }, { status: 201 });
}
