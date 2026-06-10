import { NextResponse } from "next/server";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { ContactMessage } from "@/models/ContactMessage";

export const runtime = "nodejs";

export async function GET() {
  if (!hasDatabaseConfig()) {
    return NextResponse.json({ messages: [] });
  }

  await connectToDatabase();
  const messages = await ContactMessage.find({}).sort({ createdAt: -1 }).lean();

  return NextResponse.json({ messages });
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
  const message = await ContactMessage.findByIdAndUpdate(
    payload.id,
    { status: payload.status },
    { new: true }
  );

  return message
    ? NextResponse.json({ message })
    : NextResponse.json({ error: "Message not found." }, { status: 404 });
}

export async function DELETE(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload?.id) {
    return NextResponse.json({ error: "Message id is required." }, { status: 422 });
  }

  if (!hasDatabaseConfig()) {
    return NextResponse.json({ error: "MongoDB is required." }, { status: 503 });
  }

  await connectToDatabase();
  await ContactMessage.findByIdAndDelete(payload.id);

  return NextResponse.json({ ok: true });
}
