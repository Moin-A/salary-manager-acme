import { LuBuilding2 } from "react-icons/lu";
import { Flex, Text, type FlexProps } from "@chakra-ui/react";

// mb: the gap below the brand; the mobile top bar has none.
export function SidebarBrand({ mb = "6" }: { mb?: FlexProps["mb"] }) {
  return (
    <Flex align="center" gap="2" px="2" py="3" mb={mb}>
      <LuBuilding2 size={18} />
      <Text fontWeight="semibold" fontSize="sm">
        Salary Management
      </Text>
    </Flex>
  );
}
