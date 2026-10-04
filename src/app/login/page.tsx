import type { Metadata } from "next";
import Link from "next/link";
import AuthForm from "@/components/AuthForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Log in · Ravindra Mamillapalli",
  description:
    "Sign in with Google or a free email OTP. Firebase issues a JWT session.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="auth-page">
      <div className="atmosphere" aria-hidden />
      <div className="auth-shell">
        <Link href="/" className="note-back">
          ← Back to portfolio
        </Link>
        <p className="kicker">Firebase Auth</p>
        <h1>Log in</h1>
        <p className="lead">
          Continue with Google, or request a 6-digit email OTP. Either path
          creates a Firebase JWT session.
        </p>
        <AuthForm />
      </div>
    </main>
  );
}
