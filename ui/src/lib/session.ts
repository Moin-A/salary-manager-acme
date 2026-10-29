import "server-only";
import { cookies } from "next/headers";
import { SESSION_COOKIE as TOKEN_COOKIE } from "./session-cookie";

// Matches the Rails token lifetime, so the cookie never outlives the token.
const TWELVE_HOURS = 60 * 60 * 12;

export async function getToken() {
  return (await cookies()).get(TOKEN_COOKIE)?.value;
}

export async function setToken(token: string) {
  (await cookies()).set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TWELVE_HOURS,
  });
}

export async function clearToken() {
  (await cookies()).delete(TOKEN_COOKIE);
}
