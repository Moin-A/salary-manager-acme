import NextLink from "next/link";
import { LuDownload, LuPlus } from "react-icons/lu";
import { Button } from "@chakra-ui/react";

// Export CSV stays disabled until its endpoint exists.
export function EmployeePageActions() {
  return (
    <>
      <Button asChild colorPalette="blue" size="sm">
        <NextLink href="/employees/new">
          <LuPlus /> Add Employee
        </NextLink>
      </Button>
      <Button variant="outline" size="sm" disabled title="Coming soon">
        <LuDownload /> Export CSV
      </Button>
    </>
  );
}
