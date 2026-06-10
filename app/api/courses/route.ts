import { NextResponse } from "next/server";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { placeholderCourses } from "@/lib/constants";
import { Course } from "@/models/Course";

export const runtime = "nodejs";

export async function GET() {
  if (!hasDatabaseConfig()) {
    return NextResponse.json({ courses: placeholderCourses });
  }

  await connectToDatabase();
  const courses = await Course.find({ published: true })
    .sort({ date: 1 })
    .lean();

  return NextResponse.json({ courses });
}
