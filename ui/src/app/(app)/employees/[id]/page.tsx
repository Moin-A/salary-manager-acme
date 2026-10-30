"use client";

import { useLayoutEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Box } from "@chakra-ui/react";
import { BackLink } from "@/components/back-link";
import { ErrorAlert } from "@/components/error-alert";
import { useCountries } from "@/hooks/use-countries";
import { useEmployee } from "@/hooks/use-employee";
import { EmployeeHeader } from "./_components/employee-header";
import { EmployeeInfoCard } from "./_components/employee-info-card";

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { employee, error, update } = useEmployee(id);
  const countries = useCountries();
  const [editing, setEditing] = useState(false);

  // Next hides this page instead of unmounting it, so leave edit mode when
  // it's hidden rather than coming back to a half-edited form.
  useLayoutEffect(() => {
    return () => setEditing(false);
  }, []);

  const countryName = countries.find((country) => country.id === employee?.country_id)?.name;

  return (
    <Box>
      <BackLink href="/employees" label="Back to employees" />
      {error && <ErrorAlert message={error} />}
      {employee && (
        <>
          <EmployeeHeader employee={employee} countryName={countryName} onEdit={() => setEditing(true)} editing={editing} />
          <EmployeeInfoCard
            employee={employee}
            countries={countries}
            editing={editing}
            onSave={update}
            onDoneEditing={() => setEditing(false)}
          />
        </>
      )}
    </Box>
  );
}
