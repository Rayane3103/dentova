import { jwtVerify, SignJWT } from "jose";

export const SESSION_COOKIE_NAME = "dentova_admin_session";

export type AdminSessionPayload = {
  adminId: string;
  email: string;
  role: "admin";
};

function getSecret() {
  const secret = process.env.ADMIN_JWT_SECRET;

  if (!secret) {
    throw new Error("ADMIN_JWT_SECRET is not configured.");
  }

  return new TextEncoder().encode(secret);
}

export async function signSessionToken(payload: AdminSessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as AdminSessionPayload;
}
