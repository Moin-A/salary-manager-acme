import { LuPencil } from "react-icons/lu";
import { Avatar, Button, Flex, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import type { Employee } from "@/lib/types";

type EmployeeHeaderProps = {
  employee: Employee;
  countryName?: string;
  onEdit: () => void;
  editing: boolean;
};

export function EmployeeHeader({ employee, countryName, onEdit, editing }: EmployeeHeaderProps) {
  const name = `${employee.first_name} ${employee.last_name}`;

  return (
    <Flex justify="space-between" align="center" mb="6">
      <HStack gap="4">
        <Avatar.Root size="lg" colorPalette="blue">
          <Avatar.Fallback name={name} />
        </Avatar.Root>
        <Stack gap="0">
          <Heading size="xl">{name}</Heading>
          <Text fontSize="sm" color="fg.muted">
            ID: {employee.id}
            {countryName && ` · ${countryName}`}
          </Text>
        </Stack>
      </HStack>
      <Button variant="outline" size="sm" onClick={onEdit} disabled={editing}>
        <LuPencil /> Edit Employee
      </Button>
    </Flex>
  );
}
