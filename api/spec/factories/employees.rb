FactoryBot.define do
  factory :employee do
    first_name { "Ada" }
    last_name { "Lovelace" }
    country_id { create(:country).id }

    # create(:employee, :with_salary, salary_amount: 100_000, salary_currency: "INR")
    trait :with_salary do
      transient do
        salary_amount { 1000 }
        salary_currency { "USD" }
        salary_effective_date { 1.month.ago.to_date }
      end

      after(:create) do |employee, evaluator|
        create(:salary,
          employee_id: employee.id,
          base_amount: evaluator.salary_amount,
          currency: evaluator.salary_currency,
          effective_date: evaluator.salary_effective_date)
      end
    end
  end
end
