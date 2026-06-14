import { NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/auth/admin-user";
import { authenticateMarketer } from "@/lib/auth/marketer-user";
import {
  setAdminSessionCookie,
  setMarketerSessionCookie
} from "@/lib/auth/cookies";
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

  const { email, password } = parsed.data;

  // 1. Try marketer first (more restricted role)
  const marketer = await authenticateMarketer(email, password);

  if (marketer) {
    const response = NextResponse.json({
      ok: true,
      role: "marketer",
      redirectTo: "/marketer"
    });

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

  // 2. Fall back to admin
  const admin = await authenticateAdmin(email, password);

  if (admin) {
    const response = NextResponse.json({
      ok: true,
      role: "admin",
      redirectTo: "/admin"
    });

    await setAdminSessionCookie(
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

  // 3. Neither matched
  return NextResponse.json(
    { error: "Identifiants invalides." },
    { status: 401 }
  );
}
