import { SalaryManagerApi, relayResponse } from "@/service/api";

export async function GET(req: Request) {
  const api = new SalaryManagerApi();
  const { search } = new URL(req.url); // "?country_id=…" passthrough

  const response = await api.request(`/employees${search}`);

  return relayResponse(response);
}

export async function POST(req: Request) {
  const body = await req.json();
  const api = new SalaryManagerApi();

  const response = await api.request("/employees", {
    method: "POST",
    body: JSON.stringify({ employee: body }),
  });

  return relayResponse(response);
}
