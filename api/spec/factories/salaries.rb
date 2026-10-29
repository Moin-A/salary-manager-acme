FactoryBot.define do
  factory :salary do
    employee_id { create(:employee).id }
    base_amount { 1000 }
    currency { "USD" }
    effective_date { Date.current }

    after(:build) do |salary|
      ExchangeRate.find_or_create_by!(currency_code: salary.currency) do |rate|
        rate.rate_to_usd = 1
        rate.rate_date = Date.current
      end
    end
  end
end
