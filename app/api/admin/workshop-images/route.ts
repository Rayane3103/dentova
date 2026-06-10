import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { serializeWorkshopImage } from "@/lib/data/serialize";
import { workshopImageSchema } from "@/lib/validators/workshop-image";
import { WorkshopImage } from "@/models/WorkshopImage";

export const runtime = "nodejs";

export async function GET() {
  if (!hasDatabaseConfig()) {
    return NextResponse.json({ workshopImages: [] });
  }

  await connectToDatabase();
  const images = await WorkshopImage.find({}).sort({ order: 1 }).lean();

  return NextResponse.json({
    workshopImages: images.map((doc) => serializeWorkshopImage(doc as Record<string, unknown>))
  });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = workshopImageSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 });
  }

  if (!hasDatabaseConfig()) {
    return NextResponse.json(
      { error: "MongoDB is required to create gallery images." },
      { status: 503 }
    );
  }

  await connectToDatabase();
  const workshopImage = await WorkshopImage.create(parsed.data);

  revalidatePath("/");

  return NextResponse.json({ workshopImage }, { status: 201 });
}
