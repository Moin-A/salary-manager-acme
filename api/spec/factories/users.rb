FactoryBot.define do
  factory :user do
    sequence(:login) { |n| "hr#{n}" }
    password_digest { BCrypt::Password.create("password", cost: BCrypt::Engine::MIN_COST) }
    role { "hr" }
  end
end
