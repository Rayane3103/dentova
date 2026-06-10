import { NextResponse } from "next/server";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { ClientSignup } from "@/models/ClientSignup";

export const runtime = "nodejs";

export async function GET() {
  if (!hasDatabaseConfig()) {
    return NextResponse.json({ signups: [] });
  }

  await connectToDatabase();
  const signups = await ClientSignup.find({}).sort({ createdAt: -1 }).lean();

  return NextResponse.json({ signups });
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
  const signup = await ClientSignup.findByIdAndUpdate(
    payload.id,
    { status: payload.status },
    { new: true }
  );

  return signup
    ? NextResponse.json({ signup })
    : NextResponse.json({ error: "Signup not found." }, { status: 404 });
}
