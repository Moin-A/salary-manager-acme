# Pay statistics per country for one month, in USD. Not backed by a table:
# it's computed from salaries, audit_logs, employees, countries and
# exchange_rates, and converted amounts are never stored (see docs/design.md).
#
# Steps: eligible salaries -> ranked per employee -> latest one -> stats per country.
class SalaryReport
  AMOUNT_IN_USD = "salaries.base_amount * latest_rates.rate_to_usd".freeze

  def initialize(month)
    @month_end = month.end_of_month
  end

  def by_country
    stats_per_country.map do |row|
      {
        country: row["country"],
        currency: row["country_currency"],
        average: row["average"].to_f,
        median: row["median"].to_f,
        min: row["min"].to_f,
        max: row["max"].to_f,
        employee_count: row["employee_count"].to_i
      }
    end
  end

  private

  # 1. Every salary that started by the month's end: current rows, plus the
  #    older salaries saved in the audit history. replaced_at is when a version
  #    stopped being the salary: the current row hasn't been replaced yet.
  def eligible_salaries
    current = Salary.effective_on_or_before(@month_end)
      .select(:employee_id, :base_amount, :currency, :effective_date, "'infinity'::timestamp AS replaced_at")

    historical = AuditLog.salary_changes.snapshot_effective_on_or_before(@month_end)
      .joins("JOIN salaries ON salaries.id = audit_logs.entity_id")
      .select(
        "salaries.employee_id",
        "(snapshot ->> 'base_amount')::numeric AS base_amount",
        "snapshot ->> 'currency' AS currency",
        "(snapshot ->> 'effective_date')::date AS effective_date",
        "audit_logs.created_at AS replaced_at"
      )

    Salary.from("(#{current.to_sql} UNION ALL #{historical.to_sql}) AS salaries")
  end

  # 2. Numbers each employee's eligible salaries, newest first. Two versions
  #    with the same effective date (a typo fixed): the one replaced last wins.
  def ranked_salaries
    eligible_salaries.select(
      "salaries.*",
      "ROW_NUMBER() OVER (PARTITION BY employee_id ORDER BY effective_date DESC, replaced_at DESC) AS version_rank"
    )
  end

  # 3. The salary in effect for the month: each employee's newest one.
  def salaries_in_effect
    Salary.from(ranked_salaries, :salaries).where(version_rank: 1)
  end

  # 4. Converted to USD with the latest rates, then summarised per country.
  def stats_per_country
    Salary.from(salaries_in_effect, :salaries)
      .joins(employee: :country)
      .joins("JOIN (#{ExchangeRate.latest_per_currency.to_sql}) latest_rates ON latest_rates.currency_code = salaries.currency")
      .group("countries.id")
      .order("countries.name")
      .select(
        "countries.name AS country",
        "countries.currency_code AS country_currency",
        "ROUND(AVG(#{AMOUNT_IN_USD}), 2) AS average",
        "ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY #{AMOUNT_IN_USD})::numeric, 2) AS median",
        "ROUND(MIN(#{AMOUNT_IN_USD}), 2) AS min",
        "ROUND(MAX(#{AMOUNT_IN_USD}), 2) AS max",
        "COUNT(*) AS employee_count"
      )
  end
end
