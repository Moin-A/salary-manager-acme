import { Stack, Text } from "@chakra-ui/react";
import { formatAmount } from "@/lib/format";

const LABELS: Record<string, string> = {
  base_amount: "Amount",
  currency: "Currency",
  effective_date: "Effective date",
};

// Old or new values of an audited change, one per line, e.g. "Amount: 1,200".
export function AuditValues({ values }: { values: Record<string, string> | null }) {
  if (!values) {
    return <Text color="fg.muted">—</Text>;
  }

  return (
    <Stack gap="0" fontSize="xs">
      {Object.entries(values).map(([key, value]) => (
        <Text key={key}>
          <Text as="span" color="fg.muted">
            {LABELS[key] ?? key}:
          </Text>{" "}
          {key === "base_amount" ? formatAmount(value) : value}
        </Text>
      ))}
    </Stack>
  );
}
