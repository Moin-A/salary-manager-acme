class Salary < ApplicationRecord
  has_audit_trail only: [ :base_amount, :currency, :effective_date ], event: :audit_event

  belongs_to :employee

  scope :effective_on_or_before, ->(date) { where(effective_date: ..date) }

  validates :employee_id, :effective_date, :base_amount, :currency, presence: true
  validates :employee_id, uniqueness: true
  validates :base_amount, numericality: { greater_than: 0 }, allow_nil: true
  validate :currency_must_be_supported

  before_validation :default_currency_to_country

  # The salary report only counts salary_changed rows, so fixing a mistaken
  # effective date doesn't leave a wrong history entry (see docs/design.md).
  def audit_event
    if saved_change_to_base_amount? || saved_change_to_currency?
      "salary_changed"
    else
      "effective_date_changed"
    end
  end

  private

  # The currency is optional: an employee is usually paid in their country's currency.
  def default_currency_to_country
    self.currency = employee&.country&.currency_code if currency.blank?
  end

  def currency_must_be_supported
    return if currency.blank?

    errors.add(:currency, "is not supported") unless ExchangeRate.exists?(currency_code: currency)
  end
end
