import { NextResponse } from "next/server";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { sendContactNotification } from "@/lib/mail";
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
    return NextResponse.json(
      { error: "Le service de contact n'est pas disponible pour le moment." },
      { status: 503 }
    );
  }

  await connectToDatabase();
  const message = await ContactMessage.create(parsed.data);

  let emailSent = false;

  try {
    const emailResult = await sendContactNotification(parsed.data);
    emailSent = emailResult.sent;
  } catch {
    emailSent = false;
  }

  return NextResponse.json(
    {
      message,
      emailSent
    },
    { status: 201 }
  );
}
