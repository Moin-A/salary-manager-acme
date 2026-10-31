import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Box, Flex } from "@chakra-ui/react";
import { getCurrentUser } from "@/lib/auth";
import { AppSidebar } from "./_components/app-sidebar";
import { MobileNav } from "./_components/mobile-nav";

// Every page here needs the session before it can render (or redirect to
// /login), so navigations into it block on the server by design.
export const instant = false;

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <Flex direction={{ base: "column", md: "row" }} minH="100vh" w="full" bg="gray.50">
      <AppSidebar />
      <MobileNav />
      <Box as="main" flex="1" minW="0" p={{ base: "4", md: "8" }}>
        {children}
      </Box>
    </Flex>
  );
}
