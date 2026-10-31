"use client";

import { useLayoutEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Box } from "@chakra-ui/react";
import { BackLink } from "@/components/back-link";
import { ErrorAlert } from "@/components/error-alert";
import { useCountries } from "@/hooks/use-countries";
import { useEmployee } from "@/hooks/use-employee";
import { useSalary } from "@/hooks/use-salary";
import { EmployeeHeader } from "./_components/employee-header";
import { EmployeeInfoCard } from "./_components/employee-info-card";
import { SalaryCard } from "./_components/salary-card";
import { SalaryHistory } from "./_components/salary-history";

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { employee, error, update } = useEmployee(id);
  const salary = useSalary(id);
  const countries = useCountries();
  const [editingEmployee, setEditingEmployee] = useState(false);
  const [editingSalary, setEditingSalary] = useState(false);

  // Next hides this page instead of unmounting it, so leave edit mode when
  // it's hidden rather than coming back to a half-edited form.
  useLayoutEffect(() => {
    return () => {
      setEditingEmployee(false);
      setEditingSalary(false);
    };
  }, []);

  const countryName = countries.find((country) => country.id === employee?.country_id)?.name;
  const currencies = [...new Set(countries.map((country) => country.currency_code))].sort();

  return (
    <Box>
      <BackLink href="/employees" label="Back to employees" />
      {error && <ErrorAlert message={error} />}
      {salary.error && <ErrorAlert message={salary.error} />}
      {employee && (
        <>
          <EmployeeHeader
            employee={employee}
            countryName={countryName}
            onEdit={() => setEditingEmployee(true)}
            editing={editingEmployee}
          />
          <EmployeeInfoCard
            employee={employee}
            countries={countries}
            editing={editingEmployee}
            onSave={update}
            onDoneEditing={() => setEditingEmployee(false)}
          />
        </>
      )}
      {salary.data && (
        <SalaryCard
          salary={salary.data.salary}
          currencies={currencies}
          editing={editingSalary}
          onEdit={() => setEditingSalary(true)}
          onSave={salary.save}
          onReload={salary.reload}
          onDoneEditing={() => setEditingSalary(false)}
        />
      )}
      {salary.data && <SalaryHistory history={salary.data.history} />}
    </Box>
  );
}
