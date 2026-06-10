import { NextResponse } from "next/server";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { NewsletterSubscriber } from "@/models/NewsletterSubscriber";

export const runtime = "nodejs";

export async function GET() {
  if (!hasDatabaseConfig()) {
    return NextResponse.json({ subscribers: [] });
  }

  await connectToDatabase();
  const subscribers = await NewsletterSubscriber.find({})
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ subscribers });
}

export async function DELETE(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload?.id) {
    return NextResponse.json({ error: "Subscriber id is required." }, { status: 422 });
  }

  if (!hasDatabaseConfig()) {
    return NextResponse.json({ error: "MongoDB is required." }, { status: 503 });
  }

  await connectToDatabase();
  await NewsletterSubscriber.findByIdAndDelete(payload.id);

  return NextResponse.json({ ok: true });
}
