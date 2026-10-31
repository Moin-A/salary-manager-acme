import { SalaryManagerApi, relayResponse } from "@/service/api";

export async function GET(req: Request) {
  const api = new SalaryManagerApi();
  const { search } = new URL(req.url); // "?month=YYYY-MM" passthrough

  const response = await api.request(`/reports/salaries-by-country${search}`);

  return relayResponse(response);
}
