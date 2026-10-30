import { ResultsSummary } from "@/components/results-summary";
import { TablePagination } from "@/components/table-pagination";
import type { EmployeeListResponse } from "@/lib/types";
import { EmployeeTable } from "./employee-table";

type EmployeeResultsProps = {
  data: EmployeeListResponse;
  onPageChange: (page: number) => void;
};

export function EmployeeResults({ data, onPageChange }: EmployeeResultsProps) {
  return (
    <>
      <ResultsSummary pagination={data.pagination} noun="employees" />
      <EmployeeTable employees={data.employees} />
      <TablePagination pagination={data.pagination} onPageChange={onPageChange} />
    </>
  );
}
