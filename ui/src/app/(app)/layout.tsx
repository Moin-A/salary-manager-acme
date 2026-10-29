import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AppHeader } from "./app-header";

// Every page here needs the session before it can render (or redirect to
// /login), so navigations into it block on the server by design.
export const instant = false;

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 p-6">{children}</main>
    </>
  );
}
