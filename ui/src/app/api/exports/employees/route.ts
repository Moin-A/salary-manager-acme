import { SalaryManagerApi, relayFile } from "@/service/api";

// Downloads every employee with their current salary as a CSV file.
export async function GET() {
  const api = new SalaryManagerApi();

  const response = await api.request("/exports/employees.csv", { headers: { Accept: "text/csv" } });

  return relayFile(response);
}
