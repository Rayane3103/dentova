import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { faqSchema } from "@/lib/validators/content";
import { FAQ } from "@/models/FAQ";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const payload = await request.json().catch(() => null);
  const parsed = faqSchema.partial().safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 });
  }

  if (!hasDatabaseConfig()) {
    return NextResponse.json({ error: "MongoDB is required." }, { status: 503 });
  }

  await connectToDatabase();
  const faq = await FAQ.findByIdAndUpdate(id, parsed.data, { new: true });
  revalidatePath("/");

  return faq
    ? NextResponse.json({ faq })
    : NextResponse.json({ error: "FAQ not found." }, { status: 404 });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;

  if (!hasDatabaseConfig()) {
    return NextResponse.json({ error: "MongoDB is required." }, { status: 503 });
  }

  await connectToDatabase();
  await FAQ.findByIdAndDelete(id);
  revalidatePath("/");

  return NextResponse.json({ ok: true });
}
