import { clearToken, setToken } from "@/lib/session";
import { SalaryManagerApi, relayResponse } from "@/service/api";

export async function GET() {
  const api = new SalaryManagerApi();

  const response = await api.request("/session");

  return relayResponse(response);
}

export async function POST(req: Request) {
  const { login, password } = await req.json();
  const api = new SalaryManagerApi();

  const response = await api.request("/session", {
    method: "POST",
    body: JSON.stringify({ login, password }),
  });

  if (!response.ok) {
    return relayResponse(response);
  }

  // The token goes into the httpOnly cookie; the rest of the body is
  // forwarded as-is, so browser JavaScript never sees the token.
  const { token, ...body } = await response.json();
  await setToken(token);

  return Response.json(body, { status: response.status });
}

export async function DELETE() {
  await clearToken();

  return new Response(null, { status: 204 });
}
