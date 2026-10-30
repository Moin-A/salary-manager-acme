import { Alert } from "@chakra-ui/react";

export function ErrorAlert({ message }: { message: string }) {
  return (
    <Alert.Root status="error" mb="3">
      <Alert.Indicator />
      <Alert.Title>{message}</Alert.Title>
    </Alert.Root>
  );
}
