import { SalaryManagerApi, relayResponse } from "@/service/api";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const api = new SalaryManagerApi();

  const response = await api.request(`/employees/${id}`);

  return relayResponse(response);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const api = new SalaryManagerApi();

  const response = await api.request(`/employees/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ employee: body }),
  });

  return relayResponse(response);
}
