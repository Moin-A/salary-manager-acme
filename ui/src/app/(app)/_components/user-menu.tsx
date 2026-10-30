"use client";

import { LuChevronDown, LuLogOut } from "react-icons/lu";
import { Avatar, Box, Button, Menu, Portal } from "@chakra-ui/react";
import type { User } from "@/lib/types";

export function UserMenu({ user, onLogout }: { user: User; onLogout: () => void }) {
  return (
    <Menu.Root positioning={{ placement: "top-start" }}>
      <UserMenuTrigger login={user.login} />
      <UserMenuContent role={user.role} onLogout={onLogout} />
    </Menu.Root>
  );
}

function UserMenuTrigger({ login }: { login: string }) {
  return (
    <Menu.Trigger asChild>
      <Button variant="ghost" color="white" justifyContent="flex-start" size="sm" _hover={{ bg: "whiteAlpha.200" }}>
        <Avatar.Root size="2xs" colorPalette="blue">
          <Avatar.Fallback name={login} />
        </Avatar.Root>
        <Box as="span" truncate>
          {login}
        </Box>
        <LuChevronDown />
      </Button>
    </Menu.Trigger>
  );
}

function UserMenuContent({ role, onLogout }: { role: string; onLogout: () => void }) {
  return (
    <Portal>
      <Menu.Positioner>
        <Menu.Content>
          <Menu.ItemGroup>
            <Menu.ItemGroupLabel>Signed in as {role}</Menu.ItemGroupLabel>
            <Menu.Item value="logout" onSelect={onLogout}>
              <LuLogOut />
              Log out
            </Menu.Item>
          </Menu.ItemGroup>
        </Menu.Content>
      </Menu.Positioner>
    </Portal>
  );
}
