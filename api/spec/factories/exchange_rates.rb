FactoryBot.define do
  factory :exchange_rate do
    currency_code { "USD" }
    rate_to_usd { 1 }
    rate_date { Date.current }
  end
end
