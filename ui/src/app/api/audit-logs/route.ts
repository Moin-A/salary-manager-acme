import { SalaryManagerApi, relayResponse } from "@/service/api";

export async function GET(req: Request) {
  const api = new SalaryManagerApi();
  const { search } = new URL(req.url); // "?page=…&per_page=…" passthrough

  const response = await api.request(`/audit-logs${search}`);

  return relayResponse(response);
}
