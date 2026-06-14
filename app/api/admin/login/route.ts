import { NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/auth/admin-user";
import { setSessionCookie } from "@/lib/auth/cookies";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { adminLoginSchema } from "@/lib/validators/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = adminLoginSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 });
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

  const admin = await authenticateAdmin(parsed.data.email, parsed.data.password);

  if (!admin) {
    return NextResponse.json(
      { error: "Identifiants invalides." },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ ok: true });

  await setSessionCookie(
    {
      adminId: admin._id.toString(),
      email: admin.email,
      name: admin.name ?? "Admin",
      role: "admin"
    },
    response
  );

  return response;
}
