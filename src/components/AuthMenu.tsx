"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function AuthMenu() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return <span className="auth-chip is-muted">…</span>;
  }

  if (!user) {
    return (
      <Link href="/login" className="auth-chip">
        Log in
      </Link>
    );
  }

  const label = user.name?.split(" ")[0] ?? user.email ?? "Account";

  return (
    <span className="auth-session">
      <span className="auth-chip is-user" title={user.email ?? undefined}>
        {label}
      </span>
      <button type="button" className="auth-chip is-ghost" onClick={() => void signOut()}>
        Sign out
      </button>
    </span>
  );
}
