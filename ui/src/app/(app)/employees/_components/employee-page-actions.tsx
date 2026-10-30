import { LuDownload, LuPlus } from "react-icons/lu";
import { Button } from "@chakra-ui/react";

// Disabled until adding employees and the CSV export endpoint exist.
export function EmployeePageActions() {
  return (
    <>
      <Button colorPalette="blue" size="sm" disabled title="Coming soon">
        <LuPlus /> Add Employee
      </Button>
      <Button variant="outline" size="sm" disabled title="Coming soon">
        <LuDownload /> Export CSV
      </Button>
    </>
  );
}
