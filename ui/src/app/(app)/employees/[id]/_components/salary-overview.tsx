import { Box, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { DetailField } from "@/components/detail-field";
import { formatAmount } from "@/lib/format";
import type { SalarySummary } from "@/lib/types";

export function SalaryOverview({ salary }: { salary: SalarySummary }) {
  return (
    <Stack direction={{ base: "column", md: "row" }} gap={{ base: "4", md: "6" }} align="stretch">
      <Box bg="green.50" borderRadius="md" px="5" py="4" minW={{ md: "56" }}>
        <Text fontSize="2xl" fontWeight="semibold" color="green.700">
          {formatAmount(salary.base_amount)} {salary.currency}
        </Text>
        <Text fontSize="sm" color="fg.muted">
          Effective from {salary.effective_date}
        </Text>
      </Box>
      <SimpleGrid columns={3} gap="4" flex="1" alignContent="center">
        <DetailField label="Base Amount">{formatAmount(salary.base_amount)}</DetailField>
        <DetailField label="Currency">{salary.currency}</DetailField>
        <DetailField label="Effective Date">{salary.effective_date}</DetailField>
      </SimpleGrid>
    </Stack>
  );
}
