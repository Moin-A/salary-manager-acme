"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AuditLogListResponse } from "@/lib/types";

export function useAuditLogs({ page, perPage }: { page: number; perPage: number }) {
  const router = useRouter();
  const [data, setData] = useState<AuditLogListResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Loading is derived: it's loading whenever the requested page differs from the one on screen.
  const requestKey = `${page}:${perPage}`;
  const [loadedKey, setLoadedKey] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({ page: String(page), per_page: String(perPage) });

    fetch(`/api/audit-logs?${params}`)
      .then(async (response) => {
        if (response.status === 401) {
          router.replace("/login");
          return;
        }
        if (!response.ok) {
          throw new Error("Could not load audit logs");
        }
        const body: AuditLogListResponse = await response.json();
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
          setLoadedKey(`${page}:${perPage}`);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [page, perPage, router]);

  return { data, error, loading: loadedKey !== requestKey };
}
