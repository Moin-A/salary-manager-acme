class ExchangeRate < ApplicationRecord
  scope :latest_per_currency, -> { select("DISTINCT ON (currency_code) currency_code, rate_to_usd").order(:currency_code, rate_date: :desc) }
end
