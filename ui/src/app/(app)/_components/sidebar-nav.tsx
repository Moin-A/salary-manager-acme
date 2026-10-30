"use client";

import { usePathname } from "next/navigation";
import { LuChartColumn, LuClipboardList, LuUsers } from "react-icons/lu";
import { Stack } from "@chakra-ui/react";
import { SidebarNavItem } from "./sidebar-nav-item";

// Reports is shown but disabled until its page exists.
const NAV_ITEMS = [
  { label: "Employees", href: "/employees", icon: LuUsers, ready: true },
  { label: "Reports", href: "/reports", icon: LuChartColumn, ready: false },
  { label: "Audit Logs", href: "/audit-logs", icon: LuClipboardList, ready: true },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <Stack as="nav" gap="1" flex="1">
      {NAV_ITEMS.map((item) => (
        <SidebarNavItem
          key={item.href}
          label={item.label}
          href={item.href}
          icon={item.icon}
          active={pathname.startsWith(item.href)}
          disabled={!item.ready}
        />
      ))}
    </Stack>
  );
}
