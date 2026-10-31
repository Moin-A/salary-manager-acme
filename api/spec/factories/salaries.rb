FactoryBot.define do
  factory :salary do
    employee_id { create(:employee).id }
    base_amount { 1000 }
    currency { "USD" }
    effective_date { Date.current }

    after(:build) do |salary|
      create(:exchange_rate, currency_code: salary.currency) unless ExchangeRate.exists?(currency_code: salary.currency)
    end
  end
end
