import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { workshopImageSchema } from "@/lib/validators/workshop-image";
import { WorkshopImage } from "@/models/WorkshopImage";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;

  if (!hasDatabaseConfig()) {
    return NextResponse.json({ error: "MongoDB is not configured." }, { status: 503 });
  }

  await connectToDatabase();
  const workshopImage = await WorkshopImage.findById(id).lean();

  return workshopImage
    ? NextResponse.json({ workshopImage })
    : NextResponse.json({ error: "Workshop image not found." }, { status: 404 });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const payload = await request.json().catch(() => null);
  const parsed = workshopImageSchema.partial().safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 });
  }

  if (!hasDatabaseConfig()) {
    return NextResponse.json({ mode: "preview", ok: true }, { status: 202 });
  }

  await connectToDatabase();
  const workshopImage = await WorkshopImage.findByIdAndUpdate(id, parsed.data, {
    new: true
  });

  revalidatePath("/");

  return workshopImage
    ? NextResponse.json({ workshopImage })
    : NextResponse.json({ error: "Workshop image not found." }, { status: 404 });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;

  if (!hasDatabaseConfig()) {
    return NextResponse.json({ mode: "preview", ok: true }, { status: 202 });
  }

  await connectToDatabase();
  await WorkshopImage.findByIdAndDelete(id);

  revalidatePath("/");

  return NextResponse.json({ ok: true });
}
