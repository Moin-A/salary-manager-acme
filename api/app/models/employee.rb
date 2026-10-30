class Employee < ApplicationRecord
  belongs_to :country
  has_one :salary

  validates :first_name, :last_name, :country_id, presence: true
end
