import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE_NAME,
  MARKETER_SESSION_COOKIE_NAME,
  verifySessionToken
} from "@/lib/auth/session";

const publicPaths = ["/login", "/api/auth/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths are always allowed
  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // ── Admin routes ──────────────────────────────────
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/admin")
  ) {
    const token = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return redirectToLogin(request, "/login");
    }

    try {
      const payload = await verifySessionToken(token);

      // Ensure only admin role can access admin routes
      if (payload.role !== "admin") {
        return redirectToLogin(request, "/login");
      }

      return NextResponse.next();
    } catch {
      return redirectToLogin(request, "/login");
    }
  }

  // ── Marketer routes ───────────────────────────────
  if (
    pathname.startsWith("/marketer") ||
    pathname.startsWith("/api/marketer")
  ) {
    const token = request.cookies.get(MARKETER_SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return redirectToLogin(request, "/login");
    }

    try {
      const payload = await verifySessionToken(token);

      // Ensure only marketer role can access marketer routes
      if (payload.role !== "marketer") {
        return redirectToLogin(request, "/login");
      }

      return NextResponse.next();
    } catch {
      return redirectToLogin(request, "/login");
    }
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest, loginPath: string) {
  const loginUrl = new URL(loginPath, request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/marketer/:path*",
    "/api/marketer/:path*"
  ]
};
