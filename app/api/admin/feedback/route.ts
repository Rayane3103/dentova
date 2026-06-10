import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { Feedback } from "@/models/Feedback";

export const runtime = "nodejs";

export async function GET() {
  if (!hasDatabaseConfig()) {
    return NextResponse.json({ feedback: [] });
  }

  await connectToDatabase();
  const feedback = await Feedback.find({}).sort({ createdAt: -1 }).lean();

  return NextResponse.json({ feedback });
}

export async function PATCH(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload?.id) {
    return NextResponse.json({ error: "Feedback id is required." }, { status: 422 });
  }

  if (!hasDatabaseConfig()) {
    return NextResponse.json({ error: "MongoDB is required." }, { status: 503 });
  }

  await connectToDatabase();

  const update: Record<string, unknown> = {};

  if (typeof payload.approved === "boolean") {
    update.approved = payload.approved;
    if (payload.approved && typeof payload.showOnHomepage !== "boolean") {
      update.showOnHomepage = true;
    }
    if (!payload.approved) {
      update.showOnHomepage = false;
    }
  }

  if (typeof payload.showOnHomepage === "boolean") {
    update.showOnHomepage = payload.showOnHomepage;
  }

  if (typeof payload.role === "string") {
    update.role = payload.role.trim() || "Participant";
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No valid fields to update." }, { status: 422 });
  }

  const feedback = await Feedback.findByIdAndUpdate(payload.id, update, { new: true });

  revalidatePath("/");

  return feedback
    ? NextResponse.json({ feedback })
    : NextResponse.json({ error: "Feedback not found." }, { status: 404 });
}

export async function DELETE(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload?.id) {
    return NextResponse.json({ error: "Feedback id is required." }, { status: 422 });
  }

  if (!hasDatabaseConfig()) {
    return NextResponse.json({ error: "MongoDB is required." }, { status: 503 });
  }

  await connectToDatabase();
  await Feedback.findByIdAndDelete(payload.id);
  revalidatePath("/");

  return NextResponse.json({ ok: true });
}
