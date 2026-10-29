"use client";

import { useAuth } from "@/context/auth-context";

export function AppHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
        <span className="font-semibold">Salary Manager</span>
        <div className="flex items-center gap-4 text-sm">
          {user && (
            <span className="text-zinc-600">
              {user.login} · {user.role}
            </span>
          )}
          <button onClick={logout} className="rounded border border-zinc-300 px-3 py-1 hover:bg-zinc-100">
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
