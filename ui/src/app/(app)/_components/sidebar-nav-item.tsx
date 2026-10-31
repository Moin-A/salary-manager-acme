"use client";

import NextLink from "next/link";
import type { IconType } from "react-icons";
import { Button } from "@chakra-ui/react";

type SidebarNavItemProps = {
  label: string;
  href: string;
  icon: IconType;
  active: boolean;
  disabled?: boolean;
  onNavigate?: () => void;
};

export function SidebarNavItem({ label, href, icon: Icon, active, disabled = false, onNavigate }: SidebarNavItemProps) {
  if (disabled) {
    return (
      <Button justifyContent="flex-start" size="sm" variant="ghost" color="whiteAlpha.500" disabled>
        <Icon size={16} />
        {label}
      </Button>
    );
  }

  return (
    <Button
      asChild
      justifyContent="flex-start"
      size="sm"
      variant="ghost"
      color="white"
      bg={active ? "blue.600" : "transparent"}
      _hover={{ bg: active ? "blue.600" : "whiteAlpha.200" }}
    >
      <NextLink href={href} onClick={onNavigate}>
        <Icon size={16} />
        {label}
      </NextLink>
    </Button>
  );
}
