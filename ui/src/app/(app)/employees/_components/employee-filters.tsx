"use client";

import { Stack, Spinner } from "@chakra-ui/react";
import { CountrySelect } from "@/components/country-select";
import { SearchInput } from "@/components/search-input";
import { useCountries } from "@/hooks/use-countries";

type EmployeeFiltersProps = {
  search: string;
  onSearchChange: (search: string) => void;
  countryId: string;
  onCountryChange: (countryId: string) => void;
  loading: boolean;
};

export function EmployeeFilters({ search, onSearchChange, countryId, onCountryChange, loading }: EmployeeFiltersProps) {
  const countries = useCountries();

  return (
    <Stack direction={{ base: "column", sm: "row" }} align={{ sm: "center" }} gap="3" mb="3">
      <SearchInput value={search} onChange={onSearchChange} placeholder="Search by name…" />
      <CountrySelect countries={countries} value={countryId} onChange={onCountryChange} />
      {loading && <Spinner size="sm" color="blue.500" />}
    </Stack>
  );
}
