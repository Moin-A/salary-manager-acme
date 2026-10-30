"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { EmotionRegistry } from "./emotion-registry";

export function Provider({ children }: { children: ReactNode }) {
  return (
    <EmotionRegistry>
      <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
    </EmotionRegistry>
  );
}
