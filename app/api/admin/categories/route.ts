import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { placeholderCategories } from "@/lib/constants";
import { slugify } from "@/lib/slug";
import { categorySchema } from "@/lib/validators/category";
import { Category } from "@/models/Category";

export const runtime = "nodejs";

export async function GET() {
  if (!hasDatabaseConfig()) {
    return NextResponse.json({ categories: placeholderCategories });
  }

  await connectToDatabase();
  const categories = await Category.find({}).sort({ sortOrder: 1, name: 1 }).lean();

  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = categorySchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 });
  }

  if (!hasDatabaseConfig()) {
    return NextResponse.json({ mode: "preview", ok: true }, { status: 202 });
  }

  await connectToDatabase();
  const category = await Category.create({
    ...parsed.data,
    slug: slugify(parsed.data.name)
  });

  revalidatePath("/");
  revalidatePath("/courses");

  return NextResponse.json({ category }, { status: 201 });
}
