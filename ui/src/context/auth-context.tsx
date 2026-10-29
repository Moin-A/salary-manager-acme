"use client";

import { createContext, use, useCallback, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/types";

type AuthContextValue = {
  user: User | null;
  login: (login: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ initialUser, children }: { initialUser: User | null; children: ReactNode }) {
  const [user, setUser] = useState(initialUser);
  const router = useRouter();

  const login = useCallback(
    async (login: string, password: string) => {
      const response = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Login failed");
      }

      setUser(data.user);
      router.replace("/");
      router.refresh();
    },
    [router],
  );

  const logout = useCallback(async () => {
    await fetch("/api/session", { method: "DELETE" });
    setUser(null);
    router.replace("/login");
    router.refresh();
  }, [router]);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const context = use(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
