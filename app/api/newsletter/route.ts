import { NextResponse } from "next/server";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { newsletterSchema } from "@/lib/validators/newsletter";
import { NewsletterSubscriber } from "@/models/NewsletterSubscriber";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = newsletterSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 });
  }

  if (!hasDatabaseConfig()) {
    return NextResponse.json({ mode: "preview", ok: true }, { status: 202 });
  }

  await connectToDatabase();
  const subscriber = await NewsletterSubscriber.findOneAndUpdate(
    { email: parsed.data.email.toLowerCase() },
    { $setOnInsert: { email: parsed.data.email.toLowerCase() } },
    { new: true, upsert: true }
  );

  return NextResponse.json({ subscriber }, { status: 201 });
}
