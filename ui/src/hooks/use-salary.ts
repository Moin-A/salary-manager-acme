"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { SalaryFields, SalaryResponse, SalarySaveResult } from "@/lib/types";

export function useSalary(employeeId: string) {
  const router = useRouter();
  const [data, setData] = useState<SalaryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Bumped to refetch, e.g. after a save or when a conflict asks for a reload.
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/employees/${employeeId}/salaries`)
      .then(async (response) => {
        if (response.status === 401) {
          router.replace("/login");
          return;
        }
        if (!response.ok) {
          throw new Error("Could not load the salary");
        }
        const body: SalaryResponse = await response.json();
        if (!cancelled) {
          setData(body);
          setError(null);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [employeeId, version, router]);

  const reload = useCallback(() => setVersion((current) => current + 1), []);

  const save = useCallback(
    async (fields: SalaryFields, note: string): Promise<SalarySaveResult> => {
      const salary = data?.salary;
      const response = salary
        ? await fetch(`/api/employees/${employeeId}/salaries/${salary.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...fields, lock_version: salary.lock_version, note: note || undefined }),
          })
        : await fetch(`/api/employees/${employeeId}/salaries`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fields),
          });

      if (response.status === 409) {
        const body: { error: string } = await response.json();
        return { ok: false, conflict: body.error };
      }
      if (response.status === 422) {
        const body: { errors: Record<string, string[]> } = await response.json();
        return { ok: false, errors: body.errors };
      }
      if (!response.ok) {
        return { ok: false, errors: { base: ["Could not save, please try again"] } };
      }

      reload();
      return { ok: true };
    },
    [data, employeeId, reload],
  );

  return { data, error, save, reload };
}
