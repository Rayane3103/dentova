import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE_NAME,
  MARKETER_SESSION_COOKIE_NAME,
  signSessionToken,
  verifySessionToken
} from "@/lib/auth/session";
import type {
  AdminSessionPayload,
  MarketerSessionPayload
} from "@/lib/auth/session";

const sessionCookieOptions = {
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 7,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production"
};

// ── Admin ──────────────────────────────────────────────

export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    return await verifySessionToken<AdminSessionPayload>(token);
  } catch {
    return null;
  }
}

export async function setAdminSessionCookie(
  payload: AdminSessionPayload,
  response?: NextResponse
) {
  const token = await signSessionToken(payload);

  if (response) {
    response.cookies.set(ADMIN_SESSION_COOKIE_NAME, token, sessionCookieOptions);
    return;
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE_NAME, token, sessionCookieOptions);
}

export async function clearAdminSessionCookie(response?: NextResponse) {
  const clearedOptions = { ...sessionCookieOptions, maxAge: 0 };

  if (response) {
    response.cookies.set(ADMIN_SESSION_COOKIE_NAME, "", clearedOptions);
    return;
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE_NAME, "", clearedOptions);
}

// ── Marketer ───────────────────────────────────────────

export async function getMarketerSession(): Promise<MarketerSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(MARKETER_SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    return await verifySessionToken<MarketerSessionPayload>(token);
  } catch {
    return null;
  }
}

export async function setMarketerSessionCookie(
  payload: MarketerSessionPayload,
  response?: NextResponse
) {
  const token = await signSessionToken(payload);

  if (response) {
    response.cookies.set(
      MARKETER_SESSION_COOKIE_NAME,
      token,
      sessionCookieOptions
    );
    return;
  }

  const cookieStore = await cookies();
  cookieStore.set(MARKETER_SESSION_COOKIE_NAME, token, sessionCookieOptions);
}

export async function clearMarketerSessionCookie(response?: NextResponse) {
  const clearedOptions = { ...sessionCookieOptions, maxAge: 0 };

  if (response) {
    response.cookies.set(MARKETER_SESSION_COOKIE_NAME, "", clearedOptions);
    return;
  }

  const cookieStore = await cookies();
  cookieStore.set(MARKETER_SESSION_COOKIE_NAME, "", clearedOptions);
}

// ── Legacy aliases (keep admin code working) ───────────

export {
  getAdminSession as getSession,
  setAdminSessionCookie as setSessionCookie,
  clearAdminSessionCookie as clearSessionCookie
};
