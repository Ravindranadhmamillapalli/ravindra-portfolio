import { NextResponse } from "next/server";
import {
  clearSessionCookie,
  createSessionCookie,
  readSessionUser,
} from "@/lib/auth/session";
import { isFirebaseAdminConfigured } from "@/lib/firebase/admin";

export const runtime = "nodejs";

export async function GET() {
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({ user: null });
  }
  const user = await readSessionUser();
  return NextResponse.json({ user });
}

export async function POST(request: Request) {
  try {
    if (!isFirebaseAdminConfigured()) {
      return NextResponse.json(
        { error: "Firebase Admin is not configured." },
        { status: 503 },
      );
    }

    const body = (await request.json()) as { idToken?: string };
    const idToken = body.idToken?.trim() ?? "";
    if (!idToken) {
      return NextResponse.json({ error: "Missing ID token." }, { status: 400 });
    }

    await createSessionCookie(idToken);
    const user = await readSessionUser();
    return NextResponse.json({ ok: true, user });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not create a session.";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function DELETE() {
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
