"use client";

import { useState } from "react";
import { LuMenu } from "react-icons/lu";
import { CloseButton, Drawer, Flex, IconButton, Portal } from "@chakra-ui/react";
import { useAuth } from "@/context/auth-context";
import { SidebarBrand } from "./sidebar-brand";
import { SidebarNav } from "./sidebar-nav";
import { UserMenu } from "./user-menu";

// Phones and small tablets: a top bar whose menu button opens the sidebar's
// nav in a drawer. Hidden from md up, where the sidebar shows instead.
export function MobileNav() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <Flex
      as="header"
      display={{ base: "flex", md: "none" }}
      align="center"
      justify="space-between"
      position="sticky"
      top="0"
      zIndex="sticky"
      px="2"
      bg="#0f1e33"
      color="white"
    >
      <SidebarBrand mb="0" />
      <Drawer.Root open={open} onOpenChange={(details) => setOpen(details.open)} placement="start" size="xs">
        <Drawer.Trigger asChild>
          <IconButton aria-label="Open menu" variant="ghost" color="white" _hover={{ bg: "whiteAlpha.200" }} _expanded={{ bg: "whiteAlpha.200" }}>
            <LuMenu />
          </IconButton>
        </Drawer.Trigger>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content bg="#0f1e33" color="white" p="4">
              <SidebarBrand />
              <SidebarNav onNavigate={() => setOpen(false)} />
              {user && <UserMenu user={user} onLogout={logout} />}
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" color="white" _hover={{ bg: "whiteAlpha.200" }} />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </Flex>
  );
}
