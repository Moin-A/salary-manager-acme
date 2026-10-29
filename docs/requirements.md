# Salary Management: Requirements

Build a web app that lets ACME's HR manager manage salary data for 10,000 employees across countries, replacing Excel, and answer questions about how the org pays people.

## Goal

Replace Excel with one consistent, secure source of truth for salaries, with reports HR can trust.

## Users and scale

About ten HR users, one primary HR manager. Employees do not log in. A handful of requests per second at most, with mild bursts at month-end and appraisal time.

## Scope and features

- Add and update employees, each with a country
- Add and update employee salary, with its currency and effective date; a raise adds a row and never overwrites
- View salary history per employee

### Reports

- Average salary by country for any month
  - Shown in USD by default
  - Other currencies are a stretch goal; USD only for now
  - A month uses each employee's latest salary on or before that month's last day
- Median, minimum, maximum and employee count by country, for the same month

### Other

- Export employees with their current salary to CSV
- HR login with role-based access
- Audit log of employee salary updates
- Seed script with 10,000 employees across several countries

HR logs in, manages employees and salaries, then runs the pay report. Salary updates are audited.

## Deliberately left out, and why

| Left out | Reasoning |
|---|---|
| Maker-checker approvals | Version one stays lean; the audit log gives traceability meanwhile |
| Kafka or change data capture for audit | A same-transaction write is simpler and cannot lose entries at this volume |
| Bonus pay (including daily bonus) | Not mentioned in the assignment, so a salary is a single amount |
| Employee self-service | Employees are not users in this version; it can be added later |

## Quality requirements

Consistency over availability: a short outage is fine, wrong salary data is not. Small scale, with about ten HR users. Data is encrypted in transit and at rest.
