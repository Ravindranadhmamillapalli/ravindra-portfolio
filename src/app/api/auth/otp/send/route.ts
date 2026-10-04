import { NextResponse } from "next/server";
import { sendOtpEmail } from "@/lib/auth/email";
import {
  checkOtpRateLimit,
  pendingTtl,
  setPendingOtp,
} from "@/lib/auth/otp";
import {
  hashOtp,
  isValidEmail,
  normalizeEmail,
  randomOtp,
} from "@/lib/auth/password";
import { isFirebaseAdminConfigured } from "@/lib/firebase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if (!isFirebaseAdminConfigured()) {
      return NextResponse.json(
        {
          error:
            "Add Firebase Admin credentials (FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY) to send OTP codes.",
        },
        { status: 503 },
      );
    }

    const body = (await request.json()) as { name?: string; email?: string };
    const name = body.name?.trim() ?? "";
    const email = normalizeEmail(body.email ?? "");

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
    }
    if (!checkOtpRateLimit(email)) {
      return NextResponse.json(
        { error: "Too many codes requested. Try again in 15 minutes." },
        { status: 429 },
      );
    }

    const otp = randomOtp();
    await setPendingOtp({
      name,
      email,
      otpHash: hashOtp(otp, email),
      expiresAt: Date.now() + pendingTtl(),
      attempts: 0,
    });

    const { delivered } = await sendOtpEmail(email, otp);
    const revealOtp = !delivered;

    return NextResponse.json({
      ok: true,
      email,
      delivered,
      otp: revealOtp ? otp : undefined,
      message: delivered
        ? `A 6-digit code was sent to ${email}.`
        : `Email sending is not configured, so your code is shown below. It expires in 10 minutes.`,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not send the code.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
