import NextLink from "next/link";
import { LuChevronRight } from "react-icons/lu";
import { Box, Flex, LinkBox, LinkOverlay, Stack, Text } from "@chakra-ui/react";
import { PersonName } from "@/components/person-name";
import { formatAmount } from "@/lib/format";
import type { EmployeeListItem } from "@/lib/types";

// Phones: one tappable card per employee instead of the six-column table.
export function EmployeeCardList({ employees }: { employees: EmployeeListItem[] }) {
  if (employees.length === 0) {
    return (
      <Text textAlign="center" color="fg.muted" py="8" bg="white" borderWidth="1px" borderRadius="md">
        No employees found.
      </Text>
    );
  }

  return (
    <Stack gap="2">
      {employees.map((employee) => (
        <EmployeeCard key={employee.id} employee={employee} />
      ))}
    </Stack>
  );
}

function EmployeeCard({ employee }: { employee: EmployeeListItem }) {
  const name = `${employee.first_name} ${employee.last_name}`;
  const { salary } = employee;

  return (
    <LinkBox as="article" bg="white" borderWidth="1px" borderRadius="md" p="3" _hover={{ bg: "gray.50" }}>
      <Flex align="center" gap="3">
        <Box flex="1" minW="0">
          <LinkOverlay asChild>
            <NextLink href={`/employees/${employee.id}`}>
              <PersonName name={name} />
            </NextLink>
          </LinkOverlay>
          <Flex justify="space-between" gap="2" mt="2" fontSize="sm">
            <Text color="fg.muted" truncate>
              {employee.country.name}
            </Text>
            <Text fontWeight="medium" whiteSpace="nowrap">
              {salary ? `${formatAmount(salary.base_amount)} ${salary.currency}` : "No salary"}
            </Text>
          </Flex>
          {salary && (
            <Text fontSize="xs" color="fg.muted" textAlign="end">
              Effective from {salary.effective_date}
            </Text>
          )}
        </Box>
        <LuChevronRight aria-hidden />
      </Flex>
    </LinkBox>
  );
}
