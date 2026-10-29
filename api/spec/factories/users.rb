FactoryBot.define do
  factory :user do
    sequence(:login) { |n| "hr#{n}" }
    password_digest { "x" }
    role { "hr" }
  end
end
