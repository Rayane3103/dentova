import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { slugify } from "@/lib/slug";
import { courseSchema } from "@/lib/validators/course";
import { Course } from "@/models/Course";

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
  const course = await Course.findById(id).lean();

  return course
    ? NextResponse.json({ course })
    : NextResponse.json({ error: "Course not found." }, { status: 404 });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const payload = await request.json().catch(() => null);
  const parsed = courseSchema.partial().safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 });
  }

  if (!hasDatabaseConfig()) {
    return NextResponse.json({ mode: "preview", ok: true }, { status: 202 });
  }

  await connectToDatabase();
  const update = {
    ...parsed.data,
    ...(parsed.data.title ? { slug: slugify(parsed.data.title) } : {})
  };
  const course = await Course.findByIdAndUpdate(id, update, { new: true });

  revalidatePath("/");
  revalidatePath("/courses");

  return course
    ? NextResponse.json({ course })
    : NextResponse.json({ error: "Course not found." }, { status: 404 });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;

  if (!hasDatabaseConfig()) {
    return NextResponse.json({ mode: "preview", ok: true }, { status: 202 });
  }

  await connectToDatabase();
  await Course.findByIdAndDelete(id);

  revalidatePath("/");
  revalidatePath("/courses");

  return NextResponse.json({ ok: true });
}
