"use client";

import { NativeSelect, type NativeSelectRootProps } from "@chakra-ui/react";
import type { Country } from "@/lib/types";

type CountrySelectProps = {
  countries: Country[];
  value: string;
  onChange: (countryId: string) => void;
  // null leaves out the empty option, e.g. in a form where a country is required.
  placeholder?: string | null;
  maxW?: NativeSelectRootProps["maxW"];
};

export function CountrySelect({ countries, value, onChange, placeholder = "All Countries", maxW = { base: "full", sm: "56" } }: CountrySelectProps) {
  return (
    <NativeSelect.Root size="sm" maxW={maxW} bg="white">
      <NativeSelect.Field aria-label="Country" value={value} onChange={(event) => onChange(event.target.value)}>
        {placeholder !== null && <option value="">{placeholder}</option>}
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
