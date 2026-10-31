import type { ReactNode } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

type LoadingOverlayProps = {
  loading: boolean;
  children?: ReactNode;
};

// Covers its children while they reload, so stale results read as "being
// replaced". It fades in after 150ms, so fast responses never flash it.
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
    <Box
      role="status"
      position="absolute"
      inset="0"
      zIndex="1"
      borderRadius="md"
      overflow="clip"
      bg="whiteAlpha.700"
      backdropFilter="blur(2px)"
      animationName="fade-in"
      animationDuration="200ms"
      animationDelay="150ms"
      animationFillMode="both"
    >
      {/* Just below the top of the results on every page; sticks in view
          while scrolling a long list. */}
      <Flex direction="column" align="center" gap="3" position="sticky" top="40vh" pt="16" pb="8">
        <Dots />
        <Text fontSize="sm" color="fg.muted" fontWeight="medium">
          Loading…
        </Text>
      </Flex>
    </Box>
  );
}

function Dots() {
  return (
    <Flex gap="2" aria-hidden>
      {[0, 1, 2].map((index) => (
        <Box
          key={index}
          boxSize="3"
          borderRadius="full"
          bg="blue.500"
          animationName="loadingDot"
          animationDuration="1s"
          animationTimingFunction="ease-in-out"
          animationIterationCount="infinite"
          animationFillMode="both"
          animationDelay={`${index * 0.15}s`}
          _motionReduce={{ animation: "none" }}
        />
      ))}
    </Flex>
  );
}
