import type { ReactNode } from "react";
import { Flex, Heading, HStack } from "@chakra-ui/react";

export function PageHeader({ title, actions }: { title: string; actions?: ReactNode }) {
  return (
    <Flex justify="space-between" align="center" mb="6">
      <Heading size="2xl">{title}</Heading>
      {actions && <HStack gap="2">{actions}</HStack>}
    </Flex>
  );
}
