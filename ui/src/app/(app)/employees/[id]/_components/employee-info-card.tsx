import { Card, SimpleGrid } from "@chakra-ui/react";
import { DetailField } from "@/components/detail-field";
import { findCountry } from "@/lib/countries";
import type { Country, Employee, EmployeeFields, FieldErrors } from "@/lib/types";
import { EmployeeForm } from "../../_components/employee-form";

type EmployeeInfoCardProps = {
  employee: Employee;
  countries: Country[];
  editing: boolean;
  onSave: (fields: EmployeeFields) => Promise<FieldErrors | null>;
  onDoneEditing: () => void;
};

export function EmployeeInfoCard({ employee, countries, editing, onSave, onDoneEditing }: EmployeeInfoCardProps) {
  const countryName = findCountry(countries, employee.country_id)?.name;

  return (
    <Card.Root size="sm" mb="6">
      <Card.Header>
        <Card.Title fontSize="md">Employee Information</Card.Title>
      </Card.Header>
      <Card.Body>
        {editing ? (
          <EmployeeForm
            employee={employee}
            countries={countries}
            onSave={onSave}
            onSaved={onDoneEditing}
            onCancel={onDoneEditing}
          />
        ) : (
          <SimpleGrid columns={{ base: 1, md: 3 }} gap="4">
            <DetailField label="First Name">{employee.first_name}</DetailField>
            <DetailField label="Last Name">{employee.last_name}</DetailField>
            <DetailField label="Country">{countryName ?? "—"}</DetailField>
          </SimpleGrid>
        )}
      </Card.Body>
    </Card.Root>
  );
}
