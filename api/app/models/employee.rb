class Employee < ApplicationRecord
  belongs_to :country
  has_one :salary

  validates :first_name, :last_name, :country_id, presence: true

  # Case-insensitive match anywhere in "first last", so it finds a first name,
  # a last name or a full name. sanitize_sql_like escapes % and _ in the query.
  scope :search, ->(query) {
    where("(first_name || ' ' || last_name) ILIKE ?", "%#{sanitize_sql_like(query)}%")
  }
end
