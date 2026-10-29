import { SalaryManagerApi, relayResponse } from "@/service/api";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const api = new SalaryManagerApi();

  const response = await api.request(`/employees/${id}/salaries`);

  return relayResponse(response);
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const api = new SalaryManagerApi();

  const response = await api.request(`/employees/${id}/salaries`, {
    method: "POST",
    body: JSON.stringify({ salary: body }),
  });

  return relayResponse(response);
}
