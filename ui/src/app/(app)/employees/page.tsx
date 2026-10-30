"use client";

import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { ErrorAlert } from "@/components/error-alert";
import { PageHeader } from "@/components/page-header";
import { EmployeeFilters } from "./_components/employee-filters";
import { EmployeePageActions } from "./_components/employee-page-actions";
import { EmployeeResults } from "./_components/employee-results";
import { useEmployees } from "./_components/use-employees";

const PER_PAGE = 20;

export default function EmployeesPage() {
  const [page, setPage] = useState(1);
  const [countryId, setCountryId] = useState("");
  // Name search is shown but not wired up yet; the API's ?q= filter comes next.
  const [search, setSearch] = useState("");
  const { data, error, loading } = useEmployees({ page, perPage: PER_PAGE, countryId });

  function changeCountry(nextCountryId: string) {
    setCountryId(nextCountryId);
    setPage(1);
  }

  return (
    <Box>
      <PageHeader title="Employees" actions={<EmployeePageActions />} />
      <EmployeeFilters
        search={search}
        onSearchChange={setSearch}
        countryId={countryId}
        onCountryChange={changeCountry}
        loading={loading}
      />
      {error && <ErrorAlert message={error} />}
      {data && <EmployeeResults data={data} onPageChange={setPage} />}
    </Box>
  );
}
