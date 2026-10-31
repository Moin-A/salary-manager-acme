"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { SalaryReportResponse } from "@/lib/types";

export function useSalaryReport({ month }: { month: string }) {
  const router = useRouter();
  const [data, setData] = useState<SalaryReportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Loading is derived: it's loading whenever the requested month differs from the one on screen.
  const [loadedMonth, setLoadedMonth] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({ month });

    fetch(`/api/reports/salaries-by-country?${params}`)
      .then(async (response) => {
        if (response.status === 401) {
          router.replace("/login");
          return;
        }
        if (!response.ok) {
          throw new Error("Could not load the salary report");
        }
        const body: SalaryReportResponse = await response.json();
        if (!cancelled) {
          setData(body);
          setError(null);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadedMonth(month);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [month, router]);

  return { data, error, loading: loadedMonth !== month };
}
