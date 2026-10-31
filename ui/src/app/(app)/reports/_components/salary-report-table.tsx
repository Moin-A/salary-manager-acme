import { Box, Table } from "@chakra-ui/react";
import type { CountrySalaryStats } from "@/lib/types";
import { SalaryReportRow } from "./salary-report-row";

const COLUMNS = ["Country", "Paid in", "Employees", "Average", "Median", "Min", "Max"];
const NUMERIC_COLUMNS = new Set(["Employees", "Average", "Median", "Min", "Max"]);

export function SalaryReportTable({ countries }: { countries: CountrySalaryStats[] }) {
  return (
    <Box bg="white" borderWidth="1px" borderRadius="md" overflowX="auto">
      <Table.Root size="sm">
        <Table.Header>
          <Table.Row>
            {COLUMNS.map((label) => (
              <Table.ColumnHeader key={label} textAlign={NUMERIC_COLUMNS.has(label) ? "end" : "start"}>
                {label}
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {countries.map((stats) => (
            <SalaryReportRow key={stats.country} stats={stats} />
          ))}
          {countries.length === 0 && (
            <Table.Row>
              <Table.Cell colSpan={COLUMNS.length} textAlign="center" color="fg.muted" py="8">
                No salaries were in effect this month.
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
