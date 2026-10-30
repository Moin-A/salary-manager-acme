import { Box, Table } from "@chakra-ui/react";
import type { AuditLogEntry } from "@/lib/types";
import { AuditLogRow } from "./audit-log-row";

const COLUMNS = ["Date & Time", "User", "Event Type", "Entity Type", "Entity ID", "Old Values", "New Values", "Note"];

export function AuditLogTable({ auditLogs }: { auditLogs: AuditLogEntry[] }) {
  return (
    <Box bg="white" borderWidth="1px" borderRadius="md" overflowX="auto">
      <Table.Root size="sm">
        <Table.Header>
          <Table.Row>
            {COLUMNS.map((label) => (
              <Table.ColumnHeader key={label}>{label}</Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {auditLogs.map((auditLog) => (
            <AuditLogRow key={auditLog.id} auditLog={auditLog} />
          ))}
          {auditLogs.length === 0 && (
            <Table.Row>
              <Table.Cell colSpan={COLUMNS.length} textAlign="center" color="fg.muted" py="8">
                No audit logs yet.
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
