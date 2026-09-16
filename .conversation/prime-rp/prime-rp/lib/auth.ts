import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

function getSecret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) {
    throw new Error("AUTH_SECRET must be set to a random value of at least 32 characters.");
  }
  return new TextEncoder().encode(value);
}

const COOKIE = "prime_admin_session";
export const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "MODERATOR", "SUPPORT", "EDITOR"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];
export type Session = { id: string; email: string; role: AdminRole; name: string };

export async function createSession(user: Session) {
  const token = await new SignJWT(user).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("8h").sign(getSecret());
  const jar = await cookies();
  jar.set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 8 });
}

export async function getSession() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const payload = (await jwtVerify(token, getSecret())).payload;
    if (typeof payload.id !== "string" || typeof payload.email !== "string" || typeof payload.name !== "string" || !ADMIN_ROLES.includes(payload.role as AdminRole)) return null;
    return payload as unknown as Session;
  }
  catch { return null; }
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}
