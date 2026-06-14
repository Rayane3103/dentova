import { NextResponse } from "next/server";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { pixelSchema } from "@/lib/validators/marketer";
import { Pixel } from "@/models/Pixel";
import { serializePixel } from "@/lib/data/serialize";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

// GET /api/marketer/pixels — list all pixels
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

  const pixels = await Pixel.find({}).sort({ createdAt: -1 }).lean();

  return NextResponse.json({
    pixels: pixels.map((doc) =>
      serializePixel(doc as Record<string, unknown>)
    )
  });
}

// POST /api/marketer/pixels — create a new pixel
export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = pixelSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten() },
      { status: 422 }
    );
  }

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

  // Check platform uniqueness
  const existing = await Pixel.findOne({ platform: parsed.data.platform });
  if (existing) {
    return NextResponse.json(
      {
        error: `Un pixel ${parsed.data.platform === "meta" ? "Meta" : "TikTok"} existe déjà. Supprimez-le ou modifiez-le avant d'en créer un nouveau.`
      },
      { status: 409 }
    );
  }

  // Additional platform-specific validation
  if (parsed.data.platform === "meta") {
    if (!/^\d{15,16}$/.test(parsed.data.pixelId)) {
      return NextResponse.json(
        { error: "L'ID du pixel Meta doit contenir 15 ou 16 chiffres." },
        { status: 422 }
      );
    }
  }

  try {
    const pixel = await Pixel.create({
      platform: parsed.data.platform,
      pixelId: parsed.data.pixelId,
      label: parsed.data.label || undefined,
      active: parsed.data.active ?? false,
      notes: parsed.data.notes || undefined
    });

    revalidatePath("/marketer/pixels");

    return NextResponse.json(
      { pixel: serializePixel(pixel.toObject()) },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Erreur lors de la création du pixel.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
