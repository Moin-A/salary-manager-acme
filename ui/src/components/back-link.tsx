import NextLink from "next/link";
import { LuArrowLeft } from "react-icons/lu";
import { Link } from "@chakra-ui/react";

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link asChild fontSize="sm" color="fg.muted" mb="4" display="inline-flex" gap="1" alignItems="center">
      <NextLink href={href}>
        <LuArrowLeft /> {label}
      </NextLink>
    </Link>
  );
}
