FactoryBot.define do
  factory :audit_log do
    user_id { create(:user).id }
    event_type { "salary_changed" }
    entity_type { "Salary" }
    entity_id { create(:salary).id }
    snapshot { { "base_amount" => "1000.0", "currency" => "USD", "effective_date" => Date.current.to_s } }
    created_at { 1.day.ago }
  end
end
