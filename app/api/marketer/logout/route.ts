import { NextResponse } from "next/server";
import { clearMarketerSessionCookie } from "@/lib/auth/cookies";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/", request.url));
  await clearMarketerSessionCookie(response);
  return response;
}
