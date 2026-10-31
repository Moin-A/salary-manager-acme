import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

// Chakra's default theme plus the app's own animations. Keyframes defined
// here are written into the page by Chakra, so components can use them by
// name (animationName="loadingDot").
const config = defineConfig({
  theme: {
    keyframes: {
      loadingDot: {
        "0%, 80%, 100%": { transform: "scale(0.5)", opacity: "0.35" },
        "40%": { transform: "scale(1)", opacity: "1" },
      },
      loadingBar: {
        from: { transform: "translateX(-100%)" },
        to: { transform: "translateX(250%)" },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
