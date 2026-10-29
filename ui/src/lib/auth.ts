import "server-only";
import { cacheLife } from "next/cache";
import { SalaryManagerApi } from "@/service/api";
import { getToken } from "./session";
import type { User } from "./types";

// A private cache can read the session cookie, stays out of server caches,
// and lets Next prefetch logged-in pages instead of blocking on this fetch.
export async function getCurrentUser(): Promise<User | null> {
  "use cache: private";
  cacheLife("minutes");

  if (!(await getToken())) {
    return null;
  }

  const response = await new SalaryManagerApi().request("/session");
  if (!response.ok) {
    return null;
  }

  return response.json();
}
