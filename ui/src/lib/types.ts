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
