import { Avatar, HStack, Text } from "@chakra-ui/react";

export function PersonName({ name }: { name: string }) {
  return (
    <HStack gap="3">
      <Avatar.Root size="xs" colorPalette="blue">
        <Avatar.Fallback name={name} />
      </Avatar.Root>
      <Text fontWeight="medium">{name}</Text>
    </HStack>
  );
}
