import { jwtVerify, SignJWT } from "jose";

export const ADMIN_SESSION_COOKIE_NAME = "dentova_admin_session";
export const MARKETER_SESSION_COOKIE_NAME = "dentova_marketer_session";

export type AdminSessionPayload = {
  adminId: string;
  email: string;
  name: string;
  role: "admin";
};

export type MarketerSessionPayload = {
  marketerId: string;
  email: string;
  name: string;
  role: "marketer";
};

export type SessionPayload = AdminSessionPayload | MarketerSessionPayload;

function getSecret() {
  const secret = process.env.ADMIN_JWT_SECRET;

  if (!secret) {
    throw new Error("ADMIN_JWT_SECRET is not configured.");
  }

  return new TextEncoder().encode(secret);
}

export async function signSessionToken(
  payload: SessionPayload
) {
  return new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySessionToken<T = SessionPayload>(
  token: string
): Promise<T> {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as T;
}
