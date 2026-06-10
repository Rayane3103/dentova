import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import {
  SESSION_COOKIE_NAME,
  signSessionToken,
  verifySessionToken
} from "@/lib/auth/session";
import type { AdminSessionPayload } from "@/lib/auth/session";

const sessionCookieOptions = {
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 7,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production"
};

export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

export async function setSessionCookie(
  payload: AdminSessionPayload,
  response?: NextResponse
) {
  const token = await signSessionToken(payload);

  if (response) {
    response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions);
    return;
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, sessionCookieOptions);
}

export async function clearSessionCookie(response?: NextResponse) {
  const clearedOptions = { ...sessionCookieOptions, maxAge: 0 };

  if (response) {
    response.cookies.set(SESSION_COOKIE_NAME, "", clearedOptions);
    return;
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", clearedOptions);
}
