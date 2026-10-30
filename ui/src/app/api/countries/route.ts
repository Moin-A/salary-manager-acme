import { SalaryManagerApi, relayResponse } from "@/service/api";

export async function GET() {
  const api = new SalaryManagerApi();

  const response = await api.request("/countries");

  return relayResponse(response);
}
