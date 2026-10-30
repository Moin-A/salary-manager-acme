import { Box, Table } from "@chakra-ui/react";
import type { EmployeeListItem } from "@/lib/types";
import { EmployeeRow } from "./employee-row";

const COLUMNS = [
  { label: "Name" },
  { label: "Country" },
  { label: "Current Salary", end: true },
  { label: "Currency" },
  { label: "Effective Date" },
  { label: "Actions", end: true },
];

export function EmployeeTable({ employees }: { employees: EmployeeListItem[] }) {
  return (
    <Box bg="white" borderWidth="1px" borderRadius="md" overflowX="auto">
      <Table.Root size="sm">
        <Table.Header>
          <Table.Row>
            {COLUMNS.map(({ label, end }) => (
              <Table.ColumnHeader key={label} textAlign={end ? "end" : undefined}>
                {label}
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {employees.map((employee) => (
            <EmployeeRow key={employee.id} employee={employee} />
          ))}
          {employees.length === 0 && (
            <Table.Row>
              <Table.Cell colSpan={COLUMNS.length} textAlign="center" color="fg.muted" py="8">
                No employees found.
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
