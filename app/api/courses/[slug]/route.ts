import { NextResponse } from "next/server";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { placeholderCourses } from "@/lib/constants";
import { Course } from "@/models/Course";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;

  if (!hasDatabaseConfig()) {
    const course = placeholderCourses.find((item) => item.slug === slug);
    return course
      ? NextResponse.json({ course })
      : NextResponse.json({ error: "Course not found." }, { status: 404 });
  }

  await connectToDatabase();
  const course = await Course.findOne({ published: true, slug }).lean();

  return course
    ? NextResponse.json({ course })
    : NextResponse.json({ error: "Course not found." }, { status: 404 });
}
