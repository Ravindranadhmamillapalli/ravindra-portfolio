import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { hashOtp, normalizeEmail, timingSafeTextEqual } from "./password";

const COOKIE = "portfolio.otp.pending";
const TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export type PendingOtp = {
  name: string;
  email: string;
  otpHash: string;
  expiresAt: number;
  attempts: number;
};

const rate = new Map<string, { count: number; resetAt: number }>();

function secret() {
  return (
    process.env.AUTH_SECRET ??
    process.env.FIREBASE_PRIVATE_KEY ??
    "dev-otp-secret"
  );
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function encode(pending: PendingOtp) {
  const payload = Buffer.from(JSON.stringify(pending)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function decode(token: string): PendingOtp | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;

  try {
    return JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as PendingOtp;
  } catch {
    return null;
  }
}

export function checkOtpRateLimit(email: string) {
  const key = normalizeEmail(email);
  const now = Date.now();
  const current = rate.get(key);
  if (!current || current.resetAt < now) {
    rate.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return true;
  }
  if (current.count >= 5) return false;
  current.count += 1;
  return true;
}

export async function setPendingOtp(pending: PendingOtp) {
  const jar = await cookies();
  jar.set(COOKIE, encode(pending), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TTL_MS / 1000,
  });
}

export async function readPendingOtp() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  const pending = decode(token);
  if (!pending || pending.expiresAt < Date.now()) {
    jar.delete(COOKIE);
    return null;
  }
  return pending;
}

export async function clearPendingOtp() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function verifyPendingOtp(email: string, otp: string) {
  const pending = await readPendingOtp();
  if (!pending) {
    return { ok: false as const, error: "Your code expired. Request a new one." };
  }
  if (normalizeEmail(email) !== pending.email) {
    return { ok: false as const, error: "Email does not match this code." };
  }
  if (pending.attempts >= MAX_ATTEMPTS) {
    await clearPendingOtp();
    return { ok: false as const, error: "Too many attempts. Request a new code." };
  }

  const next: PendingOtp = { ...pending, attempts: pending.attempts + 1 };
  const match = timingSafeTextEqual(
    pending.otpHash,
    hashOtp(otp.trim(), pending.email),
  );
  if (!match) {
    await setPendingOtp(next);
    return { ok: false as const, error: "That code is not correct." };
  }

  await clearPendingOtp();
  return { ok: true as const, pending };
}

export function pendingTtl() {
  return TTL_MS;
}
