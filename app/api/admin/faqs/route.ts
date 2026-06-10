import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { serializeFAQ } from "@/lib/data/serialize";
import { faqSchema } from "@/lib/validators/content";
import { FAQ } from "@/models/FAQ";

export const runtime = "nodejs";

export async function GET() {
  if (!hasDatabaseConfig()) {
    return NextResponse.json({ faqs: [] });
  }

  await connectToDatabase();
  const faqs = await FAQ.find({}).sort({ sortOrder: 1 }).lean();

  return NextResponse.json({
    faqs: faqs.map((doc) => serializeFAQ(doc as Record<string, unknown>))
  });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = faqSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 });
  }

  if (!hasDatabaseConfig()) {
    return NextResponse.json({ error: "MongoDB is required." }, { status: 503 });
  }

  await connectToDatabase();
  const faq = await FAQ.create(parsed.data);
  revalidatePath("/");

  return NextResponse.json({ faq }, { status: 201 });
}
