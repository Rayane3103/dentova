import { NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth/cookies";
import { verifyPassword } from "@/lib/auth/password";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { adminLoginSchema } from "@/lib/validators/admin";
import { AdminUser } from "@/models/AdminUser";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = adminLoginSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 });
  }

  if (!hasDatabaseConfig()) {
    return NextResponse.json(
      { error: "MongoDB is required for admin login." },
      { status: 503 }
    );
  }

  await connectToDatabase();
  const admin = await AdminUser.findOne({
    email: parsed.data.email.toLowerCase()
  });

  if (!admin) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const valid = await verifyPassword(parsed.data.password, admin.passwordHash);

  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  await setSessionCookie({
    adminId: admin._id.toString(),
    email: admin.email,
    role: "admin"
  });

  return NextResponse.json({ ok: true });
}
