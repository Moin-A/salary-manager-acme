"use client";

import { NativeSelect } from "@chakra-ui/react";
import type { Country } from "@/lib/types";

type CountrySelectProps = {
  countries: Country[];
  value: string;
  onChange: (countryId: string) => void;
  placeholder?: string;
};

export function CountrySelect({ countries, value, onChange, placeholder = "All Countries" }: CountrySelectProps) {
  return (
    <NativeSelect.Root size="sm" maxW="56" bg="white">
      <NativeSelect.Field aria-label="Country" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">{placeholder}</option>
        {countries.map((country) => (
          <option key={country.id} value={String(country.id)}>
            {country.name}
          </option>
        ))}
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  );
}
