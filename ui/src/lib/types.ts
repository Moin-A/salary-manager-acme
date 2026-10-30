export type User = {
  id: number;
  login: string;
  role: string;
};

export type Country = {
  id: number;
  name: string;
  currency_code: string;
};

export type SalarySummary = {
  id: number;
  base_amount: string;
  currency: string;
  effective_date: string;
  lock_version: number;
};

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  country_id: number;
};

export type EmployeeFields = Pick<Employee, "first_name" | "last_name" | "country_id">;

// Rails validation errors, keyed by attribute, e.g. { first_name: ["can't be blank"] }.
export type FieldErrors = Record<string, string[]>;

export type SalaryFields = {
  base_amount: string;
  currency: string;
  effective_date: string;
};

export type SalaryHistoryEntry = SalaryFields & {
  event_type: string | null;
  note: string | null;
  user_id: number | null;
  changed_at: string;
};

export type SalaryResponse = {
  salary: SalarySummary | null;
  history: SalaryHistoryEntry[];
};

// What a salary save resolves to: saved, rejected by validation, or a conflict
// because someone else changed the salary since it was loaded.
export type SalarySaveResult = { ok: true } | { ok: false; errors: FieldErrors } | { ok: false; conflict: string };

export type AuditLogEntry = {
  id: number;
  user: { id: number; login: string } | null;
  event_type: string | null;
  entity_type: string;
  entity_id: number;
  old_values: Record<string, string>;
  new_values: Record<string, string> | null;
  note: string | null;
  created_at: string;
};

export type AuditLogListResponse = {
  audit_logs: AuditLogEntry[];
  pagination: PaginationInfo;
};

export type EmployeeListItem = {
  id: number;
  first_name: string;
  last_name: string;
  country_id: number;
  country: Country;
  salary: SalarySummary | null;
};

export type PaginationInfo = {
  page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
};

export type EmployeeListResponse = {
  employees: EmployeeListItem[];
  pagination: PaginationInfo;
};
