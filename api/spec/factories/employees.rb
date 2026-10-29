FactoryBot.define do
  factory :employee do
    first_name { "Ada" }
    last_name { "Lovelace" }
    country_id { create(:country).id }
  end
end
