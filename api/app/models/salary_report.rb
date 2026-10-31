# Pay statistics per country for one month, in USD. Not backed by a table:
# it's computed from salaries, employees, countries and exchange_rates in one
# query, and converted amounts are never stored (see docs/design.md).
class SalaryReport
  BY_COUNTRY_SQL = <<~SQL.freeze
    WITH latest_rates AS (
      SELECT DISTINCT ON (currency_code) currency_code, rate_to_usd
      FROM exchange_rates
      ORDER BY currency_code, rate_date DESC
    ),
    salaries_in_effect AS (
      SELECT employees.country_id, salaries.base_amount * latest_rates.rate_to_usd AS amount_usd
      FROM salaries
      JOIN employees ON employees.id = salaries.employee_id
      JOIN latest_rates ON latest_rates.currency_code = salaries.currency
      WHERE salaries.effective_date <= :month_end
    )
    SELECT
      countries.name AS country,
      countries.currency_code AS currency,
      ROUND(AVG(amount_usd), 2) AS average,
      ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY amount_usd)::numeric, 2) AS median,
      ROUND(MIN(amount_usd), 2) AS min,
      ROUND(MAX(amount_usd), 2) AS max,
      COUNT(*) AS employee_count
    FROM salaries_in_effect
    JOIN countries ON countries.id = salaries_in_effect.country_id
    GROUP BY countries.id, countries.name, countries.currency_code
    ORDER BY countries.name
  SQL

  def initialize(month)
    @month_end = month.end_of_month
  end

  def by_country
    rows = ActiveRecord::Base.connection.select_all(
      ActiveRecord::Base.sanitize_sql([ BY_COUNTRY_SQL, { month_end: @month_end } ])
    )

    rows.map do |row|
      {
        country: row["country"],
        currency: row["currency"],
        average: row["average"].to_f,
        median: row["median"].to_f,
        min: row["min"].to_f,
        max: row["max"].to_f,
        employee_count: row["employee_count"].to_i
      }
    end
  end
end
