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
    return NextResponse.json(
      { error: "Le service newsletter n'est pas disponible pour le moment." },
      { status: 503 }
    );
  }

  await connectToDatabase();
  const subscriber = await NewsletterSubscriber.findOneAndUpdate(
    { email: parsed.data.email.toLowerCase() },
    { email: parsed.data.email.toLowerCase() },
    { upsert: true, new: true }
  );

  return NextResponse.json({ subscriber }, { status: 201 });
}
