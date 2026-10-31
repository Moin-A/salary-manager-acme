import type { ReactNode } from "react";
import { Flex, Heading, HStack } from "@chakra-ui/react";

export function PageHeader({ title, actions }: { title: string; actions?: ReactNode }) {
  return (
    <Flex justify="space-between" align="center" wrap="wrap" gap="3" mb="6">
      <Heading size={{ base: "xl", md: "2xl" }}>{title}</Heading>
      {actions && (
        <HStack gap="2" wrap="wrap">
          {actions}
        </HStack>
      )}
    </Flex>
  );
}
