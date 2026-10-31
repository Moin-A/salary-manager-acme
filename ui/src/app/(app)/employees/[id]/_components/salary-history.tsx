"use client";

import { useState } from "react";
import { LuChevronDown, LuChevronRight } from "react-icons/lu";
import { Box, Button, Card, Collapsible, Table, Text } from "@chakra-ui/react";
import { EventTypeBadge } from "@/components/event-type-badge";
import { formatAmount, formatDateTime } from "@/lib/format";
import type { SalaryHistoryEntry } from "@/lib/types";

const COLUMNS = ["Amount", "Effective from", "Change", "Changed on", "Note"];

// Past versions of the salary, newest first, collapsed by default.
// v2: paginate the history and show who made each change.
export function SalaryHistory({ history }: { history: SalaryHistoryEntry[] }) {
  const [open, setOpen] = useState(false);

  if (history.length === 0) {
    return null;
  }

  return (
    <Card.Root size="sm" mb="6">
      <Collapsible.Root open={open} onOpenChange={(details) => setOpen(details.open)}>
        {/* Even padding: Card.Header has none at the bottom, which left the title low when collapsed. */}
        <Box px="4" py="3">
          <Collapsible.Trigger asChild>
            <Button variant="plain" size="sm" px="0" fontWeight="semibold">
              {open ? <LuChevronDown /> : <LuChevronRight />}
              Salary history ({history.length} {history.length === 1 ? "change" : "changes"})
            </Button>
          </Collapsible.Trigger>
        </Box>
        <Collapsible.Content>
          <Box px="4" pb="4">
            <Box borderWidth="1px" borderRadius="md" overflowX="auto">
              <Table.Root size="sm">
                <Table.Header>
                  <Table.Row>
                    {COLUMNS.map((label) => (
                      <Table.ColumnHeader key={label}>{label}</Table.ColumnHeader>
                    ))}
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {history.map((entry, index) => (
                    <Table.Row key={`${entry.changed_at}-${index}`}>
                      <Table.Cell whiteSpace="nowrap">
                        {formatAmount(entry.base_amount)} {entry.currency}
                      </Table.Cell>
                      <Table.Cell>{entry.effective_date}</Table.Cell>
                      <Table.Cell>
                        <EventTypeBadge eventType={entry.event_type} />
                      </Table.Cell>
                      <Table.Cell whiteSpace="nowrap">{formatDateTime(entry.changed_at)}</Table.Cell>
                      <Table.Cell>{entry.note ?? <Text color="fg.muted">—</Text>}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          </Box>
        </Collapsible.Content>
      </Collapsible.Root>
    </Card.Root>
  );
}
