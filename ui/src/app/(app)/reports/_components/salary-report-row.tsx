import { Table } from "@chakra-ui/react";
import { formatUsd } from "@/lib/format";
import type { CountrySalaryStats } from "@/lib/types";

export function SalaryReportRow({ stats }: { stats: CountrySalaryStats }) {
  return (
    <Table.Row>
      <Table.Cell fontWeight="medium">{stats.country}</Table.Cell>
      <Table.Cell>{stats.currency}</Table.Cell>
      <Table.Cell textAlign="end">{stats.employee_count.toLocaleString("en-US")}</Table.Cell>
      <Table.Cell textAlign="end">{formatUsd(stats.average)}</Table.Cell>
      <Table.Cell textAlign="end">{formatUsd(stats.median)}</Table.Cell>
      <Table.Cell textAlign="end">{formatUsd(stats.min)}</Table.Cell>
      <Table.Cell textAlign="end">{formatUsd(stats.max)}</Table.Cell>
    </Table.Row>
  );
}
