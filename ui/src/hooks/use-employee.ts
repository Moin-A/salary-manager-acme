"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Employee, EmployeeFields, FieldErrors } from "@/lib/types";

export function useEmployee(id: string) {
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/employees/${id}`)
      .then(async (response) => {
        if (response.status === 401) {
          router.replace("/login");
          return;
        }
        if (!response.ok) {
          throw new Error(response.status === 404 ? "Employee not found" : "Could not load employee");
        }
        const body: Employee = await response.json();
        if (!cancelled) {
          setEmployee(body);
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
  }, [id, router]);

  // Returns the validation errors when the save is rejected, or null when it succeeds.
  const update = useCallback(
    async (fields: EmployeeFields): Promise<FieldErrors | null> => {
      const response = await fetch(`/api/employees/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });

      if (response.status === 422) {
        const body: { errors: FieldErrors } = await response.json();
        return body.errors;
      }
      if (!response.ok) {
        return { base: ["Could not save, please try again"] };
      }

      setEmployee(await response.json());
      return null;
    },
    [id],
  );

  return { employee, error, update };
}
