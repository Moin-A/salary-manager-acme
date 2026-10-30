import { Table, Text } from "@chakra-ui/react";
import { PersonName } from "@/components/person-name";
import { formatDateTime } from "@/lib/format";
import type { AuditLogEntry } from "@/lib/types";
import { AuditValues } from "./audit-values";
import { EventTypeBadge } from "./event-type-badge";

export function AuditLogRow({ auditLog }: { auditLog: AuditLogEntry }) {
  return (
    <Table.Row verticalAlign="top">
      <Table.Cell whiteSpace="nowrap">{formatDateTime(auditLog.created_at)}</Table.Cell>
      <Table.Cell>{auditLog.user ? <PersonName name={auditLog.user.login} /> : <Text color="fg.muted">System</Text>}</Table.Cell>
      <Table.Cell>
        <EventTypeBadge eventType={auditLog.event_type} />
      </Table.Cell>
      <Table.Cell>{auditLog.entity_type}</Table.Cell>
      <Table.Cell>#{auditLog.entity_id}</Table.Cell>
      <Table.Cell>
        <AuditValues values={auditLog.old_values} />
      </Table.Cell>
      <Table.Cell>
        <AuditValues values={auditLog.new_values} />
      </Table.Cell>
      <Table.Cell>{auditLog.note ?? <Text color="fg.muted">—</Text>}</Table.Cell>
    </Table.Row>
  );
}
