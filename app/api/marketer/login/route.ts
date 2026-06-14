import { NextResponse } from "next/server";
import { authenticateMarketer } from "@/lib/auth/marketer-user";
import { setMarketerSessionCookie } from "@/lib/auth/cookies";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { marketerLoginSchema } from "@/lib/validators/marketer";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = marketerLoginSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten() },
      { status: 422 }
    );
  }

  if (!hasDatabaseConfig()) {
    return NextResponse.json(
      { error: "Service indisponible. Veuillez réessayer plus tard." },
      { status: 503 }
    );
  }

  if (!process.env.ADMIN_JWT_SECRET) {
    return NextResponse.json(
      { error: "Service indisponible. Veuillez réessayer plus tard." },
      { status: 503 }
    );
  }

  try {
    await connectToDatabase();
  } catch {
    return NextResponse.json(
      { error: "Service indisponible. Veuillez réessayer plus tard." },
      { status: 503 }
    );
  }

  const marketer = await authenticateMarketer(
    parsed.data.email,
    parsed.data.password
  );

  if (!marketer) {
    return NextResponse.json(
      { error: "Identifiants invalides." },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ ok: true });

  await setMarketerSessionCookie(
    {
      marketerId: marketer._id.toString(),
      email: marketer.email,
      name: marketer.name ?? "Marketing",
      role: "marketer"
    },
    response
  );

  return response;
}
