import { createHash, randomInt, timingSafeEqual } from "crypto";

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));
}

export function hashOtp(otp: string, email: string) {
  const secret =
    process.env.AUTH_SECRET ?? process.env.FIREBASE_PRIVATE_KEY ?? "dev-otp-secret";
  return createHash("sha256")
    .update(`${otp}:${normalizeEmail(email)}:${secret}`)
    .digest("hex");
}

export function timingSafeTextEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function randomOtp() {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}
