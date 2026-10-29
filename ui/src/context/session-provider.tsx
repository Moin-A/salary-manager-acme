import type { ReactNode } from "react";
import { getCurrentUser } from "@/lib/auth";
import { AuthProvider } from "./auth-context";

export async function SessionProvider({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  return <AuthProvider initialUser={user}>{children}</AuthProvider>;
}
