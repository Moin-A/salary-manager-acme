FactoryBot.define do
  factory :country do
    name { "USA" }
    currency_code { "USD" }
    time_zone { "America/New_York" }

    trait :india do
      name { "India" }
      currency_code { "INR" }
      time_zone { "Asia/Kolkata" }
    end
  end
end
