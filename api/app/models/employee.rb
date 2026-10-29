class Employee < ApplicationRecord
  validates :first_name, :last_name, :country_id, presence: true
end
