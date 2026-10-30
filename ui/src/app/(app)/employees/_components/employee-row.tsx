import NextLink from "next/link";
import { LuEye, LuPencil } from "react-icons/lu";
import { HStack, IconButton, Table } from "@chakra-ui/react";
import { PersonName } from "@/components/person-name";
import { formatAmount } from "@/lib/format";
import type { EmployeeListItem } from "@/lib/types";

export function EmployeeRow({ employee }: { employee: EmployeeListItem }) {
  const name = `${employee.first_name} ${employee.last_name}`;
  const { salary } = employee;

  return (
    <Table.Row>
      <Table.Cell>
        <PersonName name={name} />
      </Table.Cell>
      <Table.Cell>{employee.country.name}</Table.Cell>
      <Table.Cell textAlign="end">{salary ? formatAmount(salary.base_amount) : "—"}</Table.Cell>
      <Table.Cell>{salary?.currency ?? "—"}</Table.Cell>
      <Table.Cell>{salary?.effective_date ?? "—"}</Table.Cell>
      <Table.Cell textAlign="end">
        <EmployeeActions employeeId={employee.id} name={name} />
      </Table.Cell>
    </Table.Row>
  );
}

function EmployeeActions({ employeeId, name }: { employeeId: number; name: string }) {
  const href = `/employees/${employeeId}`;

  return (
    <HStack gap="1" justify="flex-end">
      <IconButton asChild aria-label={`View ${name}`} size="xs" variant="ghost">
        <NextLink href={href}>
          <LuEye />
        </NextLink>
      </IconButton>
      <IconButton asChild aria-label={`Edit ${name}`} size="xs" variant="ghost">
        <NextLink href={href}>
          <LuPencil />
        </NextLink>
      </IconButton>
    </HStack>
  );
}
