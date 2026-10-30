import { LuBuilding2 } from "react-icons/lu";
import { Flex, Text } from "@chakra-ui/react";

export function SidebarBrand() {
  return (
    <Flex align="center" gap="2" px="2" py="3" mb="6">
      <LuBuilding2 size={18} />
      <Text fontWeight="semibold" fontSize="sm">
        Salary Management
      </Text>
    </Flex>
  );
}
