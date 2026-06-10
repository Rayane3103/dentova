import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { getCategories } from "@/lib/data/queries";
import { slugify } from "@/lib/slug";
import { categorySchema } from "@/lib/validators/category";
import { Category } from "@/models/Category";

export const runtime = "nodejs";

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = categorySchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 });
  }

  if (!hasDatabaseConfig()) {
    return NextResponse.json(
      { error: "MongoDB is required to create categories." },
      { status: 503 }
    );
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
