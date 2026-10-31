FactoryBot.define do
  factory :salary do
    employee_id { create(:employee).id }
    base_amount { 1000 }
    currency { "USD" }
    effective_date { Date.current }

    after(:build) do |salary|
      # No currency means the model picks the country's; the spec sets that rate up.
      next if salary.currency.blank?

      create(:exchange_rate, currency_code: salary.currency) unless ExchangeRate.exists?(currency_code: salary.currency)
    end
  end
end
