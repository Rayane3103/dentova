import { NextResponse } from "next/server";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { getMarketerStats } from "@/lib/data/queries";

export const runtime = "nodejs";

export async function GET() {
  if (!hasDatabaseConfig()) {
    return NextResponse.json(
      { error: "Base de données non configurée." },
      { status: 503 }
    );
  }

  try {
    await connectToDatabase();
  } catch {
    return NextResponse.json(
      { error: "Impossible de se connecter à MongoDB." },
      { status: 503 }
    );
  }

  const stats = await getMarketerStats();

  if (!stats) {
    return NextResponse.json(
      { error: "Impossible de récupérer les statistiques." },
      { status: 500 }
    );
  }

  return NextResponse.json(stats);
}
