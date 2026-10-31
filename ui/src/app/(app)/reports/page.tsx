"use client";

import { useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import { ErrorAlert } from "@/components/error-alert";
import { LoadingOverlay } from "@/components/loading-overlay";
import { PageHeader } from "@/components/page-header";
import { useSalaryReport } from "@/hooks/use-salary-report";
import { ExchangeRatesNote } from "./_components/exchange-rates-note";
import { MonthPicker } from "./_components/month-picker";
import { SalaryReportTable } from "./_components/salary-report-table";

// "2026-10" for the viewer's current month.
function currentMonth() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
}

export default function ReportsPage() {
  const [month, setMonth] = useState(currentMonth);
  const { data, error, loading } = useSalaryReport({ month });

  return (
    <Box>
      <PageHeader
        title="Salary Report"
        actions={<MonthPicker month={month} onChange={setMonth} />}
      />
      <Text mb="4" color="fg.muted">
        Pay by country for the selected month, using each employee&apos;s salary in effect that month.
      </Text>
      {error && <ErrorAlert message={error} />}
      <LoadingOverlay loading={loading}>
        {data && (
          <>
            <SalaryReportTable countries={data.countries} />
            <ExchangeRatesNote rates={data.exchange_rates} />
          </>
        )}
      </LoadingOverlay>
    </Box>
  );
}
