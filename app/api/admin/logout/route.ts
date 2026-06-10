import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth/cookies";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url));
  await clearSessionCookie(response);
  return response;
}
