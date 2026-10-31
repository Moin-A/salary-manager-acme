"use client";

import { useState, type FormEvent } from "react";
import { Button, Field, HStack, Input, SimpleGrid, chakra } from "@chakra-ui/react";
import { CountrySelect } from "@/components/country-select";
import { ErrorAlert } from "@/components/error-alert";
import type { Country, Employee, EmployeeFields, FieldErrors } from "@/lib/types";

type EmployeeFormProps = {
  // Leave out to add a new employee; pass one to edit it.
  employee?: Employee;
  countries: Country[];
  onSave: (fields: EmployeeFields) => Promise<FieldErrors | null>;
  onSaved?: () => void;
  onCancel: () => void;
};

export function EmployeeForm({ employee, countries, onSave, onSaved, onCancel }: EmployeeFormProps) {
  const [firstName, setFirstName] = useState(employee?.first_name ?? "");
  const [lastName, setLastName] = useState(employee?.last_name ?? "");
  const [countryId, setCountryId] = useState(employee ? String(employee.country_id) : "");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    // No country picked is sent as null, so Rails reports it as blank like the other fields.
    const saveErrors = await onSave({
      first_name: firstName,
      last_name: lastName,
      country_id: countryId ? Number(countryId) : null,
    });
    setSaving(false);

    if (saveErrors) {
      setErrors(saveErrors);
    } else {
      onSaved?.();
    }
  }

  const countryError = errors.country_id?.[0] ?? errors.country?.[0];

  return (
    <chakra.form onSubmit={handleSubmit}>
      {errors.base && <ErrorAlert message={errors.base[0]} />}

      <SimpleGrid columns={{ base: 1, md: 3 }} gap="4">
        <Field.Root invalid={Boolean(errors.first_name)}>
          <Field.Label>First Name</Field.Label>
          <Input size="sm" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
          <Field.ErrorText>{errors.first_name?.[0]}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={Boolean(errors.last_name)}>
          <Field.Label>Last Name</Field.Label>
          <Input size="sm" value={lastName} onChange={(event) => setLastName(event.target.value)} />
          <Field.ErrorText>{errors.last_name?.[0]}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={Boolean(countryError)}>
          <Field.Label>Country</Field.Label>
          <CountrySelect
            countries={countries}
            value={countryId}
            onChange={setCountryId}
            placeholder={employee ? null : "Select a country"}
            maxW="full"
          />
          <Field.ErrorText>{countryError}</Field.ErrorText>
        </Field.Root>
      </SimpleGrid>

      <HStack justify="flex-end" gap="2" mt="4">
        <Button variant="ghost" size="sm" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" colorPalette="blue" size="sm" loading={saving} loadingText="Saving…">
          {employee ? "Save" : "Add Employee"}
        </Button>
      </HStack>
    </chakra.form>
  );
}
