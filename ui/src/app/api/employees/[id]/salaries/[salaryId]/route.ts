import { SalaryManagerApi, relayResponse } from "@/service/api";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string; salaryId: string }> }) {
  const { id, salaryId } = await params;
  const body = await req.json();
  const api = new SalaryManagerApi();

  const response = await api.request(`/employees/${id}/salaries/${salaryId}`, {
    method: "PATCH",
    body: JSON.stringify({ salary: body }),
  });

  return relayResponse(response);
}
