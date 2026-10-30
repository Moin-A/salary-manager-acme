import { SalaryManagerApi, relayResponse } from "@/service/api";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string; salaryId: string }> }) {
  const { id, salaryId } = await params;
  // note isn't a salary column: Rails reads it next to the salary, for the audit log.
  const { note, ...salary } = await req.json();
  const api = new SalaryManagerApi();

  const response = await api.request(`/employees/${id}/salaries/${salaryId}`, {
    method: "PATCH",
    body: JSON.stringify({ salary, note }),
  });

  return relayResponse(response);
}
