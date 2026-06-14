import { NextResponse } from "next/server";
import {
  clearAdminSessionCookie,
  clearMarketerSessionCookie
} from "@/lib/auth/cookies";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/", request.url));
  // Clear both cookies — whichever one is set will be cleared
  await clearAdminSessionCookie(response);
  await clearMarketerSessionCookie(response);
  return response;
}
