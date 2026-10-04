"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getRedirectResult,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import {
  getFirebaseAuth,
  isFirebaseClientConfigured,
} from "@/lib/firebase/client";

type AuthUser = {
  uid: string;
  email: string | null;
  name: string | null;
  photoURL: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  configured: boolean;
  refreshSession: (idToken: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  configured: false,
  refreshSession: async () => undefined,
  signOut: async () => undefined,
});

function toAuthUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    photoURL: user.photoURL,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isFirebaseClientConfigured();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async (idToken: string) => {
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
  }, []);

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }

    const auth = getFirebaseAuth();

    // Complete Google redirect sign-in if the popup path fell back.
    void getRedirectResult(auth).catch(() => undefined);

    const unsub = onAuthStateChanged(auth, async (next) => {
      setUser(next ? toAuthUser(next) : null);
      setLoading(false);
      if (next) {
        try {
          const token = await next.getIdToken();
          await refreshSession(token);
        } catch {
          // Client auth still works if the session cookie cannot be written.
        }
      }
    });
    return () => unsub();
  }, [configured, refreshSession]);

  const signOut = useCallback(async () => {
    if (configured) {
      await firebaseSignOut(getFirebaseAuth());
    }
    await fetch("/api/auth/session", { method: "DELETE" });
    setUser(null);
  }, [configured]);

  const value = useMemo(
    () => ({ user, loading, configured, refreshSession, signOut }),
    [user, loading, configured, refreshSession, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
