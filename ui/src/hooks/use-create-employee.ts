"use client";

import { useCallback } from "react";
import type { Employee, EmployeeFields, FieldErrors } from "@/lib/types";

export type CreateEmployeeResult = { ok: true; employee: Employee } | { ok: false; errors: FieldErrors };

export function useCreateEmployee() {
  return useCallback(async (fields: EmployeeFields): Promise<CreateEmployeeResult> => {
    const response = await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });

    if (response.status === 422) {
      const body: { errors: FieldErrors } = await response.json();
      return { ok: false, errors: body.errors };
    }
    if (!response.ok) {
      return { ok: false, errors: { base: ["Could not add the employee, please try again"] } };
    }

    return { ok: true, employee: await response.json() };
  }, []);
}
