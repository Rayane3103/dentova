import { NextResponse } from "next/server";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { signupSchema } from "@/lib/validators/signup";
import { ClientSignup } from "@/models/ClientSignup";
import { NewsletterSubscriber } from "@/models/NewsletterSubscriber";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = signupSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 });
  }

  if (!hasDatabaseConfig()) {
    return NextResponse.json(
      { error: "Le service d'inscription n'est pas disponible pour le moment." },
      { status: 503 }
    );
  }

  await connectToDatabase();
  const signup = await ClientSignup.create(parsed.data);

  if (parsed.data.newsletterOptIn) {
    await NewsletterSubscriber.findOneAndUpdate(
      { email: parsed.data.email.toLowerCase() },
      { email: parsed.data.email.toLowerCase() },
      { upsert: true, new: true }
    );
  }

  return NextResponse.json({ signup }, { status: 201 });
}
