import { cookies } from "next/headers";
import { getAdminAuth } from "@/lib/firebase/admin";

export const SESSION_COOKIE = "fb-session";
const MAX_AGE_MS = 60 * 60 * 24 * 5 * 1000;

export type SessionUser = {
  uid: string;
  email: string | null;
  name: string | null;
  picture: string | null;
};

export async function createSessionCookie(idToken: string) {
  const session = await getAdminAuth().createSessionCookie(idToken, {
    expiresIn: MAX_AGE_MS,
  });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_MS / 1000,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function readSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const decoded = await getAdminAuth().verifySessionCookie(token, true);
    return {
      uid: decoded.uid,
      email: decoded.email ?? null,
      name: decoded.name ?? null,
      picture: decoded.picture ?? null,
    };
  } catch {
    return null;
  }
}
