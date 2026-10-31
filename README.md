# Salary Manager for ACME

A web app for ACME's HR team to manage the salaries of 10,000 employees across eight countries, replacing Excel, and to answer how the company pays people.

- **Live app:** https://salary-manager-acme-ror.vercel.app (log in as `admin` / `admin123`)
- **Demo video:** https://www.youtube.com/watch?v=tpRYDtaJzWE

## Features

- **Employees:** list with server-side search, country filter and pagination; add and edit employees
- **Salaries:** add and edit an employee's salary with its currency and effective date. The currency defaults to the employee's country's currency
- **Safe concurrent edits:** optimistic locking turns a stale edit into a conflict with a reload, instead of overwriting someone else's change; a duplicate salary is a conflict too
- **Audit trail:** every salary change records who made it, when, why, and the old values, in the same transaction as the change
- **Salary history:** each employee's past salaries, rebuilt from the audit trail
- **Salary report:** for any month, per country: headcount and average, median, minimum and maximum pay in USD, using each employee's salary in effect that month, with the exchange rates used
- **CSV export:** every employee with their current salary
- **Access:** login required; one Admin role with full access (CanCanCan)

## Stack

- **API:** Ruby on Rails 8.1, PostgreSQL, RSpec
- **UI:** Next.js 16, React, Chakra UI. The UI proxies `/api/*` to Rails and keeps the session token in an httpOnly cookie
- **Hosting:** Vercel (UI), Render (API and Postgres)

## Documentation

| Document | What's in it |
|---|---|
| [Requirements](docs/requirements.md) | Goal, scope, and what was deliberately left out, with reasons |
| [Design](docs/design.md) | Data model, API, validation and concurrency, access, and how the report works |
| [Trade-offs and performance](docs/tradeoffs.md) | The main decisions, what each costs, and how the app stays fast |
| [AI usage](docs/ai-usage.md) | How AI tools were used, the instructions given, and where the output was steered or corrected |

The commit history shows how the solution evolved: most features are a `red` commit with a failing spec, then a `green` commit with the code that passes it.

## Running locally

Requirements: Ruby 3.4.1, Node.js 20 or later, and PostgreSQL.

### API (port 3001)

```sh
cd api
bundle install
bin/rails db:setup      # creates the database, loads the schema and seeds it
bin/rails server -p 3001
```

The seeds create 8 countries with exchange rates, 10,000 employees with salaries, and an admin user. Log in as **`admin` / `admin123`**, or set `ADMIN_LOGIN` and `ADMIN_PASSWORD` before seeding to choose your own (do this for any deployed environment).

### UI (port 3000)

```sh
cd ui
cp .env.example .env    # RAILS_API_URL=http://localhost:3001
npm install
npm run dev
```

Then open http://localhost:3000.

## Tests

```sh
cd api
bundle exec rspec       # models, controllers, the audit trail, the report and the export
bundle exec rubocop
```

```sh
cd ui
npx tsc --noEmit
npm run lint
```
