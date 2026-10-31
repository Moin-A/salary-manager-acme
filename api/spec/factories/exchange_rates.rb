FactoryBot.define do
  factory :exchange_rate do
    currency_code { "USD" }
    # Realistic rates for the currencies specs use; anything else is 1:1.
    rate_to_usd { { "INR" => 0.012 }.fetch(currency_code, 1) }
    rate_date { Date.current }
  end
end
