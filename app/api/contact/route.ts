import { NextResponse } from "next/server";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { contactSchema } from "@/lib/validators/contact";
import { ContactMessage } from "@/models/ContactMessage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 });
  }

  if (!hasDatabaseConfig()) {
    return NextResponse.json({ mode: "preview", ok: true }, { status: 202 });
  }

  await connectToDatabase();
  const message = await ContactMessage.create(parsed.data);

  return NextResponse.json({ message }, { status: 201 });
}
