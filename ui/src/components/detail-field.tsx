import type { ReactNode } from "react";
import { Stack, Text } from "@chakra-ui/react";

// A read-only label/value pair for detail cards.
export function DetailField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Stack gap="1">
      <Text fontSize="xs" color="fg.muted">
        {label}
      </Text>
      <Text>{children}</Text>
    </Stack>
  );
}
