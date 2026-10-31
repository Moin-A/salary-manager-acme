# Trade-offs and Performance

The decisions that shaped the solution, what each one costs, and why the cost was accepted.

## Trade-offs

### Readability over compactness

Logic is split into small, named pieces, even when that means more methods, more files and more indirection.

- **The salary report.** It started as one large SQL string. It is now a chain of named steps, each its own method in `SalaryReport`: eligible salaries → ranked per employee → the salary in effect for the month → stats per country. Each step is Active Record where possible, with SQL only where Active Record can't express it (`UNION ALL`, the `ROW_NUMBER()` window function, reading the JSON snapshot, `percentile_cont`).
- **Audit "new values".** An audit row stores only the old values. Finding what replaced them lives in its own class, `AuditLog::NewValues`, with named helpers (`entire_history`, `logs_created_after`) instead of inline logic in the controller.
- **CSV export.** A small `CsvExport` base class with `define_column`, so an export lists its columns in one place instead of spreading column logic across the model and the controller.
- **Small UI pieces.** Shared helpers (`findCountry`, `currencyCodes`, `formatUsd`) and one component per piece of UI.

Cost: more files and methods to navigate, and the report's generated SQL is nested several levels deep, so the raw query is harder to read than the Ruby that builds it. Accepted because each piece can be read, tested and changed on its own, and the names explain the intent. For code that HR's pay figures depend on, being easy to check matters more than being short.

### Salary history from the audit log, not a history table

An employee has one salary row, updated in place. Each update writes the old values to `audit_logs`, and both the salary history and the report rebuild past versions from there.

Cost: the report has to combine current rows with audit snapshots. Accepted because there is one source of truth for history, and the audit trail and the history can never disagree.

### Auditing in a Rails callback, not a database trigger

The audit row is written by an `after_update` callback with `create!`, inside the update's transaction, so a change is never saved without its audit row.

Cost: `update_column`, `update_all`, `insert_all` and raw SQL skip callbacks, so a change made that way is not audited. The app never changes salaries that way, so given the time available a callback was enough. v2: a Postgres trigger, with the user and note passed via `SET LOCAL`.

### Optimistic locking for concurrent edits

A salary update must send the `lock_version` it read; if someone saved in between, the update returns 409 and the UI offers a reload.

Cost: the second editor has to redo their change. Accepted because with about ten HR users, conflicts are rare, and nobody's change is ever silently overwritten. Pessimistic locks would hold rows while someone has a form open.

### Scope kept deliberately small

- One role, Admin, with full access (CanCanCan, so more roles are a change to one `Ability` class).
- The salary history is listed in full in a collapsible section; pagination and showing who made each change are v2.
- The CSV export always includes every employee, not just the current search.

The requirements doc lists everything left out and why.

## Performance

Measured on the 10,000 seeded employees, on a laptop, in development.

| Area | What keeps it fast |
|---|---|
| Employees list | Server-side search, filter and pagination (20 per page, at most 100); `includes(:country, :salary)` avoids a query per row |
| Salary report | One SQL query, about 0.1 s: filtering, ranking, conversion and aggregation all happen in Postgres, with no per-employee loops in Ruby |
| Audit logs page | New values for a page of logs are found with one query for the related history and one for the current records, instead of one query per row |
| CSV export | About 1.5 s for 10,000 rows, built in memory with associations preloaded. v2: stream it if the data grows |
| Seeding | `insert_all` in batches instead of 10,000 individual saves |
| Indexes | Unique `salaries.employee_id` (also enforces one salary per employee), `audit_logs (entity_type, entity_id, created_at)` for history lookups, `employees.country_id`, unique `exchange_rates (currency_code, rate_date)` |

Known limit: name search uses `ILIKE` with a leading wildcard, which can't use a regular index, so every search scans the employees table. That is fine at 10,000 rows but won't scale. The first step would be a `pg_trgm` index, which speeds up `ILIKE` while staying in Postgres. For a much larger dataset, or richer search such as typo-tolerant matching and relevance ranking, search would move to a dedicated engine like Elasticsearch, kept in sync from the database.
