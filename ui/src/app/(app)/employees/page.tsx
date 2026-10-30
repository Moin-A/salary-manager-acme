"use client";

import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { ErrorAlert } from "@/components/error-alert";
import { PageHeader } from "@/components/page-header";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useEmployees } from "@/hooks/use-employees";
import { EmployeeFilters } from "./_components/employee-filters";
import { EmployeePageActions } from "./_components/employee-page-actions";
import { EmployeeResults } from "./_components/employee-results";

const PER_PAGE = 20;

export default function EmployeesPage() {
  const [page, setPage] = useState(1);
  const [countryId, setCountryId] = useState("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search.trim());
  const { data, error, loading } = useEmployees({ page, perPage: PER_PAGE, countryId, search: debouncedSearch });

  function changeCountry(nextCountryId: string) {
    setCountryId(nextCountryId);
    setPage(1);
  }

  function changeSearch(nextSearch: string) {
    setSearch(nextSearch);
    setPage(1);
  }

  return (
    <Box>
      <PageHeader title="Employees" actions={<EmployeePageActions />} />
      <EmployeeFilters
        search={search}
        onSearchChange={changeSearch}
        countryId={countryId}
        onCountryChange={changeCountry}
        loading={loading}
      />
      {error && <ErrorAlert message={error} />}
      {data && <EmployeeResults data={data} onPageChange={setPage} />}
    </Box>
  );
}
