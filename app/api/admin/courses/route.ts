import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { getAllCourses } from "@/lib/data/queries";
import { slugify } from "@/lib/slug";
import { courseSchema } from "@/lib/validators/course";
import { Course } from "@/models/Course";

export const runtime = "nodejs";

function normalizeCoursePayload<
  T extends { courseType?: string; cycleDates?: Date[]; date: Date; title: string }
>(data: T) {
  if (data.courseType === "cycle" && data.cycleDates?.[0]) {
    return { ...data, date: data.cycleDates[0] };
  }

  return { ...data, courseType: "formation", cycleDates: [] };
}

export async function GET() {
  const courses = await getAllCourses();
  return NextResponse.json({ courses });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = courseSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 });
  }

  if (!hasDatabaseConfig()) {
    return NextResponse.json(
      { error: "MongoDB is required to create courses." },
      { status: 503 }
    );
  }

  await connectToDatabase();
  const data = normalizeCoursePayload(parsed.data);
  const course = await Course.create({
    ...data,
    slug: slugify(data.title)
  });

  revalidatePath("/");
  revalidatePath("/courses");

  return NextResponse.json({ course }, { status: 201 });
}
