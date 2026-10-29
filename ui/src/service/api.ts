import "server-only";
import { clearToken, getToken } from "@/lib/session";

// Server-side client for the Rails API. Every request carries the session
// token from the httpOnly cookie as `Authorization: Bearer`, so route handlers
// never deal with auth headers themselves.
export class SalaryManagerApi {
  private baseUrl = process.env.RAILS_API_URL ?? "http://localhost:3001";

  async request(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const token = await getToken();
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    return fetch(`${this.baseUrl}${endpoint}`, { ...options, headers });
  }
}

// Pass a Rails response back to the browser with its status intact. Rails may
// answer with an empty or non-JSON body (204, an HTML error page), so never
// assume JSON. A 401 means the token is no longer valid, so drop the cookie.
export async function relayResponse(response: Response): Promise<Response> {
  if (response.status === 401) {
    await clearToken();
  }

  const text = await response.text();
  if (!text) {
    return new Response(null, { status: response.status });
  }

  try {
    return Response.json(JSON.parse(text), { status: response.status });
  } catch {
    return Response.json({ error: text }, { status: response.status });
  }
}
