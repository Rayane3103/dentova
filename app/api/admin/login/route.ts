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
      {
        error:
          "MongoDB n'est pas configure sur Vercel. Ajoutez MONGODB_URI dans les variables d'environnement."
      },
      { status: 503 }
    );
  }

  if (!process.env.ADMIN_JWT_SECRET) {
    return NextResponse.json(
      {
        error:
          "ADMIN_JWT_SECRET est manquant. Ajoutez une cle secrete dans les variables d'environnement Vercel."
      },
      { status: 503 }
    );
  }

  await connectToDatabase();
  const admin = await AdminUser.findOne({
    email: parsed.data.email.toLowerCase()
  });

  if (!admin) {
    return NextResponse.json(
      {
        error:
          "Identifiants invalides. Si c'est la premiere connexion, executez npm run seed:admin avec vos variables ADMIN_EMAIL et ADMIN_PASSWORD."
      },
      { status: 401 }
    );
  }

  const valid = await verifyPassword(parsed.data.password, admin.passwordHash);

  if (!valid) {
    return NextResponse.json({ error: "Identifiants invalides." }, { status: 401 });
  }

  await setSessionCookie({
    adminId: admin._id.toString(),
    email: admin.email,
    role: "admin"
  });

  return NextResponse.json({ ok: true });
}
