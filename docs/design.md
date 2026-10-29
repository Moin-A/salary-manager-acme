# Salary Management: Design Doc

28 Oct 2026 · @Moin

## Requirements

### Functional

1. HR adds and updates employees (name, country).
2. HR adds salaries: base amount, optional bonus, currency, effective date. A raise adds a row, never overwrites.
3. HR views salary history per employee.
4. HR runs average salary by country for any month, in USD.
5. HR exports employees with current salary to CSV.
6. Login with roles, and an audit log of every change.
7. A seed script loads 10,000 employees.

### Non-functional

Consistency over availability, secure (login, role checks, HTTPS, encryption at rest), small scale (about ten HR users, one region, one server).

## Core entities

| Entity | Columns | Notes |
|---|---|---|
| `employees` | `id, first_name, last_name, country_id` | Not the HR users |
| `salaries` | `id, employee_id, base_amount, bonus, currency, effective_date` | Unique on `(employee_id, effective_date)`; never updated in place |
| `countries` | `id, name, currency_code, time_zone` | Seeded |
| `exchange_rates` | `currency_code, rate_to_usd, rate_date` | Refreshed by cron twice a day |
| `users` | `id, login, password_digest, role` | HR staff only |
| `audit_logs` | `id, user_id, event_type, entity_type, entity_id, snapshot, created_at` | Append-only |

Validation is lean: names, country and effective date required, base amount above zero, a currency from the supported list (each has an exchange rate). A duplicate raise returns 409. Two employees may share a name.

## API

| Endpoint | Purpose |
|---|---|
| `POST /session` | Login |
| `GET, POST /employees` | List with filters, create |
| `GET, PATCH /employees/:id` | Show with current salary, update |
| `GET, POST /employees/:id/salaries` | History, add a row |
| `GET /reports/average-salary` | Params: `month`, `currency` (default USD) |
| `GET /exports/employees.csv` | CSV export |
| `GET /audit-logs` | HR only |

## Reports

For a month, take each employee's newest salary on or before the month's last day (window function), convert to USD with the latest rate, and average by country, all in one SQL query. Reports show the rate date. Converted values are never stored.

## Audit and stack

The service writes the audit row in the same transaction as the change. Next.js on Vercel proxies `/api/*` to Rails and Postgres on Render, with all logic in Rails.

## Out of scope

CSV import is a stretch goal (validate, then confirm in one transaction). Left out for v1: maker-checker approvals, GDPR and SOX work, Kafka, and employee self-service.
