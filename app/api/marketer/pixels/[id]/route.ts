import { NextResponse } from "next/server";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { pixelUpdateSchema } from "@/lib/validators/marketer";
import { Pixel } from "@/models/Pixel";
import { serializePixel } from "@/lib/data/serialize";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

// PATCH /api/marketer/pixels/[id] — update a pixel
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const payload = await request.json().catch(() => null);
  const parsed = pixelUpdateSchema.safeParse(payload);

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

  const existing = await Pixel.findById(id);
  if (!existing) {
    return NextResponse.json(
      { error: "Pixel introuvable." },
      { status: 404 }
    );
  }

  // If pixelId is being updated, validate platform-specific format
  if (parsed.data.pixelId) {
    const platform = parsed.data.platform || existing.platform;
    if (platform === "meta" && !/^\d{15,16}$/.test(parsed.data.pixelId)) {
      return NextResponse.json(
        { error: "L'ID du pixel Meta doit contenir 15 ou 16 chiffres." },
        { status: 422 }
      );
    }
  }

  const updateData: Record<string, unknown> = {};

  if (parsed.data.pixelId !== undefined) updateData.pixelId = parsed.data.pixelId;
  if (parsed.data.label !== undefined) updateData.label = parsed.data.label || null;
  if (parsed.data.active !== undefined) updateData.active = parsed.data.active;
  if (parsed.data.notes !== undefined) updateData.notes = parsed.data.notes || null;

  // If activating, set verifiedAt
  if (parsed.data.active === true && !existing.active) {
    updateData.verifiedAt = new Date();
  }

  // If deactivating, clear verifiedAt
  if (parsed.data.active === false) {
    updateData.verifiedAt = null;
  }

  try {
    const updated = await Pixel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    }).lean();

    if (!updated) {
      return NextResponse.json(
        { error: "Pixel introuvable après mise à jour." },
        { status: 404 }
      );
    }

    revalidatePath("/marketer/pixels");
    revalidatePath("/", "layout");

    return NextResponse.json({
      pixel: serializePixel(updated as Record<string, unknown>)
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Erreur lors de la mise à jour.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/marketer/pixels/[id] — delete a pixel
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

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

  const existing = await Pixel.findById(id);
  if (!existing) {
    return NextResponse.json(
      { error: "Pixel introuvable." },
      { status: 404 }
    );
  }

  await Pixel.findByIdAndDelete(id);

  revalidatePath("/marketer/pixels");
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true });
}
