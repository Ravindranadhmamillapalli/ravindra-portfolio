import { NextResponse } from "next/server";
import { verifyPendingOtp } from "@/lib/auth/otp";
import { isValidEmail, normalizeEmail } from "@/lib/auth/password";
import { getAdminAuth, isFirebaseAdminConfigured } from "@/lib/firebase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if (!isFirebaseAdminConfigured()) {
      return NextResponse.json(
        { error: "Firebase Admin is not configured." },
        { status: 503 },
      );
    }

    const body = (await request.json()) as { email?: string; otp?: string };
    const email = normalizeEmail(body.email ?? "");
    const otp = body.otp?.trim() ?? "";

    if (!isValidEmail(email) || !/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { error: "Enter the 6-digit code from your email." },
        { status: 400 },
      );
    }

    const result = await verifyPendingOtp(email, otp);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const auth = getAdminAuth();
    let uid: string;
    try {
      const existing = await auth.getUserByEmail(email);
      uid = existing.uid;
      if (result.pending.name && existing.displayName !== result.pending.name) {
        await auth.updateUser(uid, { displayName: result.pending.name });
      }
    } catch {
      const created = await auth.createUser({
        email,
        emailVerified: true,
        displayName: result.pending.name || undefined,
      });
      uid = created.uid;
    }

    const customToken = await auth.createCustomToken(uid, {
      login: "email-otp",
    });

    return NextResponse.json({ ok: true, customToken });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not verify the code.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
