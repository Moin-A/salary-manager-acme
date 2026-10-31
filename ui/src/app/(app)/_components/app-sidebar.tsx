"use client";

import { Flex } from "@chakra-ui/react";
import { useAuth } from "@/context/auth-context";
import { SidebarBrand } from "./sidebar-brand";
import { SidebarNav } from "./sidebar-nav";
import { UserMenu } from "./user-menu";

export function AppSidebar() {
  const { user, logout } = useAuth();

  return (
    <Flex as="aside" display={{ base: "none", md: "flex" }} direction="column" w="220px" h="100vh" position="sticky" top="0" flexShrink={0} p="4" bg="#0f1e33" color="white">
      <SidebarBrand />
      <SidebarNav />
      {user && <UserMenu user={user} onLogout={logout} />}
    </Flex>
  );
}
