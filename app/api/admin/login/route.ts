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
      {
        error:
          "MongoDB n'est pas configure. Ajoutez MONGODB_URI dans les variables d'environnement."
      },
      { status: 503 }
    );
  }

  if (!process.env.ADMIN_JWT_SECRET) {
    return NextResponse.json(
      {
        error:
          "ADMIN_JWT_SECRET est manquant. Ajoutez une cle secrete dans les variables d'environnement."
      },
      { status: 503 }
    );
  }

  try {
    await connectToDatabase();
  } catch {
    return NextResponse.json(
      {
        error:
          "Impossible de se connecter a MongoDB. Verifiez MONGODB_URI sur Render."
      },
      { status: 503 }
    );
  }

  const admin = await authenticateAdmin(parsed.data.email, parsed.data.password);

  if (!admin) {
    return NextResponse.json(
      {
        error:
          "Identifiants invalides. Verifiez ADMIN_EMAIL et ADMIN_PASSWORD dans Render, puis redeployez."
      },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ ok: true });

  await setSessionCookie(
    {
      adminId: admin._id.toString(),
      email: admin.email,
      role: "admin"
    },
    response
  );

  return response;
}
