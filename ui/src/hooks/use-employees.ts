"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { EmployeeListResponse } from "@/lib/types";

type Filters = { page: number; perPage: number; countryId: string; search: string };

export function useEmployees({ page, perPage, countryId, search }: Filters) {
  const router = useRouter();
  const [data, setData] = useState<EmployeeListResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Loading is derived: the data on screen belongs to loadedKey, so it's
  // loading whenever the requested page/filter differs from that.
  const requestKey = `${page}:${perPage}:${countryId}:${search}`;
  const [loadedKey, setLoadedKey] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({ page: String(page), per_page: String(perPage) });
    if (countryId) {
      params.set("country_id", countryId);
    }
    if (search) {
      params.set("q", search);
    }

    fetch(`/api/employees?${params}`)
      .then(async (response) => {
        if (response.status === 401) {
          router.replace("/login");
          return;
        }
        if (!response.ok) {
          throw new Error("Could not load employees");
        }
        const body: EmployeeListResponse = await response.json();
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
          setLoadedKey(`${page}:${perPage}:${countryId}:${search}`);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [page, perPage, countryId, search, router]);

  return { data, error, loading: loadedKey !== requestKey };
}
