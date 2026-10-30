"use client";

import { useState } from "react";
import { Box, Spinner } from "@chakra-ui/react";
import { ErrorAlert } from "@/components/error-alert";
import { PageHeader } from "@/components/page-header";
import { ResultsSummary } from "@/components/results-summary";
import { TablePagination } from "@/components/table-pagination";
import { useAuditLogs } from "@/hooks/use-audit-logs";
import { AuditLogTable } from "./_components/audit-log-table";

const PER_PAGE = 20;

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const { data, error, loading } = useAuditLogs({ page, perPage: PER_PAGE });

  return (
    <Box>
      <PageHeader title="Audit Logs" actions={loading ? <Spinner size="sm" color="blue.500" /> : undefined} />
      {error && <ErrorAlert message={error} />}
      {data && (
        <>
          <ResultsSummary pagination={data.pagination} noun="logs" />
          <AuditLogTable auditLogs={data.audit_logs} />
          <TablePagination pagination={data.pagination} onPageChange={setPage} />
        </>
      )}
    </Box>
  );
}
