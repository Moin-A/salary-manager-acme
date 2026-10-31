# How AI Was Used

I built this with Claude Code as a pair programmer. I set the direction, the structure and the quality bar; the AI drafted code, ran the specs and checked the app in a browser; I reviewed every step before anything was committed.

## Working agreement

Standing instructions I gave the AI, and kept enforcing:

- Test first: a **red** commit with the failing spec, then a **green** commit with the code. One spec at a time, in small steps.
- Commit only when I say so. Commit messages follow `red/green/refactor/feat(scope): summary [Feature]`, one area per commit.
- Specs should read clearly: `let` for repeated values, `context` blocks for situations, realistic data, and checks on specific error messages rather than just "invalid".
- Follow patterns from my earlier projects where they fit (for example the API client base class and the export structure), but improve them rather than copy them.
- Keep components and methods small, and prefer readability.

## Where I steered or corrected the AI

These are examples where the first draft was not what I wanted.

**The report query.** The first version was one large SQL string. I asked for it to be rebuilt in steps:

> "First find the effective range, then join salaries and audit logs to get all the eligible salaries, then rank them, then take the latest one. Each one should be its own scope. Use SQL only if needed, otherwise Active Record. Focus on readability."

The result is the chain of methods in `SalaryReport`. I also tried a `WITH` (CTE) version and a constant for the window function, and reverted both because they read worse to me.

**The report specs.** The first specs were hard to follow. Over several rounds I asked for:

- `context` blocks per situation, with the request inside each spec;
- FactoryBot traits instead of setup helpers, and later explicit records instead of a trait that hid too much;
- named dates (`last_month`, `this_month`, `next_month`) instead of `1.month.ago.beginning_of_month.to_date`;
- a salary that changes over the months using an existing employee, with a shared history and one change per context.

**Design decisions I changed:**

- Pessimistic locking was proposed for concurrent edits; I chose optimistic locking.
- The audit note was first global state; I asked for it to live on the record being saved.
- A separate paginated salary-history endpoint was built; I reverted it and kept a collapsible section for v1, noting pagination as v2.
- Duplicate salary creates: I first chose to document the existing 422, then decided to implement 409 to match the design, with the race handled in `ApplicationController`.
- Naming: `column` became `define_column` in the export class, and `history` became `entire_history` in the audit code.
- Scope: I ruled out audit-log filters and seed specs as not needed.

## Understanding before accepting

When the AI produced something I did not fully follow, I asked it to explain before keeping it, for example: `UNION ALL` and why it needs a subquery, `ROW_NUMBER() OVER (PARTITION BY …)`, `Data.define` versus `Struct`, `group_by` versus SQL `GROUP BY`, and whether the audit write is atomic. Several of these explanations led to changes, such as the readability rewrite of the report.

## Verification

- Every step ran the full RSpec suite; the API has 99 specs.
- UI changes were checked with typecheck, lint and a scripted headless-browser run of the real flow (log in, act, read the page), including screenshots for layout issues.
- I reviewed each diff and the generated SQL before committing.
