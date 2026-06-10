import { NextResponse } from "next/server";
import { getPublishedCourses } from "@/lib/data/queries";

export const runtime = "nodejs";

export async function GET() {
  const courses = await getPublishedCourses();
  return NextResponse.json({ courses });
}
