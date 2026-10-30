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

    # One employee per amount, each paid in the country's currency:
    # create(:country, :with_salaried_employees, salary_amounts: [ 1000, 2000, 6000 ])
    trait :with_salaried_employees do
      transient do
        salary_amounts { [ 1000 ] }
      end

      after(:create) do |country, evaluator|
        evaluator.salary_amounts.each do |amount|
          create(:employee, :with_salary, country_id: country.id, salary_amount: amount, salary_currency: country.currency_code)
        end
      end
    end
  end
end
