"use client";

import { useState, type FormEvent } from "react";
import {
  browserPopupRedirectResolver,
  signInWithCustomToken,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import {
  getFirebaseAuth,
  googleProvider,
  isFirebaseClientConfigured,
} from "@/lib/firebase/client";

type Step = "email" | "otp";

function getAuthError(error: unknown): { code: string; message: string } {
  if (typeof error === "object" && error !== null) {
    const record = error as { code?: unknown; message?: unknown };
    return {
      code: typeof record.code === "string" ? record.code : "",
      message:
        typeof record.message === "string"
          ? record.message
          : "Google sign-in failed.",
    };
  }
  return { code: "", message: "Google sign-in failed." };
}

function authErrorMessage(error: unknown) {
  const { code, message } = getAuthError(error);
  switch (code) {
    case "auth/operation-not-allowed":
      return "Enable the Google provider in Firebase Console → Authentication → Sign-in method.";
    case "auth/unauthorized-domain":
      return "Add this site’s host to Firebase Console → Authentication → Settings → Authorized domains (use localhost, not 127.0.0.1 or a LAN IP).";
    case "auth/popup-blocked":
      return "The sign-in popup was blocked. Allow popups for this site and try again.";
    case "auth/popup-closed-by-user":
      return "Sign-in was cancelled before it finished.";
    case "auth/cancelled-popup-request":
      return "Another sign-in popup is already open.";
    default:
      return code ? `${message} (${code})` : message;
  }
}

export default function AuthForm() {
  const router = useRouter();
  const { refreshSession } = useAuth();
  const configured = isFirebaseClientConfigured();
  const [step, setStep] = useState<Step>("email");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const finish = async (idToken: string) => {
    await refreshSession(idToken);
    router.push("/");
    router.refresh();
  };

  const onGoogle = async () => {
    if (!configured) return;
    setBusy(true);
    setMessage("");
    const auth = getFirebaseAuth();
    const provider = googleProvider();
    try {
      const result = await signInWithPopup(
        auth,
        provider,
        browserPopupRedirectResolver,
      );
      const idToken = await result.user.getIdToken();
      await finish(idToken);
    } catch (error) {
      // Popup can fail on some hosts; redirect is the reliable fallback.
      const { code, message } = getAuthError(error);
      if (
        code === "auth/popup-blocked" ||
        code === "auth/cancelled-popup-request" ||
        /requested action is invalid/i.test(message)
      ) {
        try {
          await signInWithRedirect(auth, provider, browserPopupRedirectResolver);
          return;
        } catch (redirectError) {
          setMessage(authErrorMessage(redirectError));
          setBusy(false);
          return;
        }
      }
      setMessage(authErrorMessage(error));
      setBusy(false);
    }
  };

  const onSendOtp = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const response = await fetch("/api/auth/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    const data = (await response.json()) as {
      error?: string;
      message?: string;
      otp?: string;
    };
    setBusy(false);
    if (!response.ok) {
      setMessage(data.error ?? "Could not send the code.");
      return;
    }
    setDevOtp(data.otp ?? "");
    setMessage("");
    setStep("otp");
  };

  const onVerify = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const response = await fetch("/api/auth/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const data = (await response.json()) as {
      error?: string;
      customToken?: string;
    };
    if (!response.ok || !data.customToken) {
      setBusy(false);
      setMessage(data.error ?? "That code did not work.");
      return;
    }
    try {
      const credential = await signInWithCustomToken(
        getFirebaseAuth(),
        data.customToken,
      );
      const idToken = await credential.user.getIdToken();
      await finish(idToken);
    } catch (error) {
      setBusy(false);
      setMessage(error instanceof Error ? error.message : "Could not start a JWT session.");
    }
  };

  return (
    <div className="auth-card">
      {step === "email" && (
        <>
          <button
            type="button"
            className="auth-google"
            onClick={() => void onGoogle()}
            disabled={busy || !configured}
          >
            <GoogleMark />
            Continue with Google
          </button>
          {!configured && (
            <p className="auth-hint">
              Add the <code>NEXT_PUBLIC_FIREBASE_*</code> keys to enable Google
              Sign-In.
            </p>
          )}
          <p className="auth-split">or email OTP</p>
          <form className="auth-form" onSubmit={(e) => void onSendOtp(e)}>
            <label>
              Name <span>(optional)</span>
              <input
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <p className="auth-hint">
              We email a 6-digit code. Firebase then issues a JWT session.
            </p>
            <button type="submit" className="auth-submit" disabled={busy}>
              {busy ? "Sending code…" : "Send email OTP"}
            </button>
          </form>
        </>
      )}

      {step === "otp" && (
        <form className="auth-form" onSubmit={(e) => void onVerify(e)}>
          <p className="auth-hint">
            Enter the code sent to <strong>{email}</strong>.
          </p>
          {devOtp && (
            <p className="auth-dev-otp">
              Login code: <code>{devOtp}</code>
            </p>
          )}
          <label>
            One-time password
            <input
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="\d{6}"
              maxLength={6}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            />
          </label>
          <button type="submit" className="auth-submit" disabled={busy}>
            {busy ? "Verifying…" : "Verify and continue"}
          </button>
          <button
            type="button"
            className="auth-linkish"
            disabled={busy}
            onClick={() => {
              setStep("email");
              setOtp("");
              setDevOtp("");
              setMessage("");
            }}
          >
            Use a different email
          </button>
        </form>
      )}

      {message && <p className="auth-alert">{message}</p>}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5c-.3 1.5-1.2 2.8-2.5 3.7v3h4c2.4-2.2 3.5-5.4 3.5-8.8z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-4-3c-1.1.8-2.5 1.2-3.9 1.2-3 0-5.6-2-6.5-4.7H1.4v3.1C3.4 21.4 7.4 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.5 14.6c-.2-.7-.4-1.4-.4-2.1s.1-1.4.4-2.1V7.3H1.4C.5 9 0 10.9 0 12.5s.5 3.5 1.4 5.2l4.1-3.1z"
      />
      <path
        fill="#EA4335"
        d="M12 4.8c1.7 0 3.3.6 4.5 1.7l3.4-3.4C17.9 1.1 15.2 0 12 0 7.4 0 3.4 2.6 1.4 6.5l4.1 3.1C6.4 6.8 9 4.8 12 4.8z"
      />
    </svg>
  );
}
