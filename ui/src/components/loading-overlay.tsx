import type { ReactNode } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

type LoadingOverlayProps = {
  loading: boolean;
  children?: ReactNode;
};

// Covers its children while they reload, so stale results read as "being
// replaced". It fades in after 150ms (in CSS), so fast responses never flash it.
// With nothing to cover yet (the first load), it reserves some space instead.
export function LoadingOverlay({ loading, children }: LoadingOverlayProps) {
  return (
    <Box position="relative" minH={children ? undefined : "48"} aria-busy={loading}>
      {children}
      {loading && <Overlay />}
    </Box>
  );
}

function Overlay() {
  return (
    <Flex
      role="status"
      position="absolute"
      inset="0"
      zIndex="1"
      align="flex-start"
      justify="center"
      pt="24"
      borderRadius="md"
      overflow="hidden"
      bg="whiteAlpha.700"
      backdropFilter="blur(2px)"
      style={{ animation: "loading-overlay-in 200ms ease-out 150ms both" }}
    >
      <ProgressBar />
      <Flex direction="column" align="center" gap="3" position="sticky" top="40%">
        <Dots />
        <Text fontSize="sm" color="fg.muted" fontWeight="medium">
          Loading…
        </Text>
      </Flex>
    </Flex>
  );
}

// A thin bar sliding along the top edge.
function ProgressBar() {
  return (
    <Box position="absolute" top="0" insetX="0" h="3px" bg="blue.100" overflow="hidden">
      <Box
        className="loading-motion"
        h="full"
        w="40%"
        bg="blue.500"
        borderRadius="full"
        style={{ animation: "loading-bar 1.1s ease-in-out infinite" }}
      />
    </Box>
  );
}

function Dots() {
  return (
    <Flex gap="2" aria-hidden>
      {[0, 1, 2].map((index) => (
        <Box
          key={index}
          className="loading-motion"
          boxSize="3"
          borderRadius="full"
          bg="blue.500"
          style={{ animation: `loading-dot 1s ease-in-out ${index * 0.15}s infinite both` }}
        />
      ))}
    </Flex>
  );
}
