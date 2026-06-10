import { NextResponse } from "next/server";
import { getCourseBySlug } from "@/lib/data/queries";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  return course
    ? NextResponse.json({ course })
    : NextResponse.json({ error: "Course not found." }, { status: 404 });
}
