import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";

const publicAdminPaths = ["/admin/login", "/api/admin/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicAdminPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return redirectToLogin(request);
  }

  try {
    await verifySessionToken(token);
    return NextResponse.next();
  } catch {
    return redirectToLogin(request);
  }
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};
