"use client";

import { useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Card } from "@chakra-ui/react";
import { BackLink } from "@/components/back-link";
import { PageHeader } from "@/components/page-header";
import type { EmployeeFields, FieldErrors } from "@/lib/types";
import { useCountries } from "@/hooks/use-countries";
import { useCreateEmployee } from "@/hooks/use-create-employee";
import { EmployeeForm } from "../_components/employee-form";

export default function NewEmployeePage() {
  const router = useRouter();
  const countries = useCountries();
  const createEmployee = useCreateEmployee();
  // Next hides this page instead of unmounting it; a new key gives an empty form next time.
  const [formKey, setFormKey] = useState(0);

  useLayoutEffect(() => {
    return () => setFormKey((key) => key + 1);
  }, []);

  // On success, open the new employee, where their salary can be added.
  async function save(fields: EmployeeFields): Promise<FieldErrors | null> {
    const result = await createEmployee(fields);
    if (!result.ok) {
      return result.errors;
    }
    router.push(`/employees/${result.employee.id}`);
    return null;
  }

  return (
    <Box>
      <BackLink href="/employees" label="Back to employees" />
      <PageHeader title="Add Employee" />
      <Card.Root size="sm">
        <Card.Body>
          <EmployeeForm key={formKey} countries={countries} onSave={save} onCancel={() => router.push("/employees")} />
        </Card.Body>
      </Card.Root>
    </Box>
  );
}
