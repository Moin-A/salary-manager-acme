import NextLink from "next/link";
import { LuDownload, LuPlus } from "react-icons/lu";
import { Button } from "@chakra-ui/react";

export function EmployeePageActions() {
  return (
    <>
      <Button asChild colorPalette="blue" size="sm">
        <NextLink href="/employees/new">
          <LuPlus /> Add Employee
        </NextLink>
      </Button>
      {/* A plain link: the browser downloads the file the API route sends back. */}
      <Button asChild variant="outline" size="sm">
        <a href="/api/exports/employees" download>
          <LuDownload /> Export CSV
        </a>
      </Button>
    </>
  );
}
