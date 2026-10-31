import { Box } from "@chakra-ui/react";
import { ResultsSummary } from "@/components/results-summary";
import { TablePagination } from "@/components/table-pagination";
import type { EmployeeListResponse } from "@/lib/types";
import { EmployeeCardList } from "./employee-card-list";
import { EmployeeTable } from "./employee-table";

type EmployeeResultsProps = {
  data: EmployeeListResponse;
  onPageChange: (page: number) => void;
};

export function EmployeeResults({ data, onPageChange }: EmployeeResultsProps) {
  return (
    <>
      <ResultsSummary pagination={data.pagination} noun="employees" />
      {/* Both render; CSS shows one, so server and browser HTML match. */}
      <Box hideBelow="md">
        <EmployeeTable employees={data.employees} />
      </Box>
      <Box hideFrom="md">
        <EmployeeCardList employees={data.employees} />
      </Box>
      <TablePagination pagination={data.pagination} onPageChange={onPageChange} />
    </>
  );
}
