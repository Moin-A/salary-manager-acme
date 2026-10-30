class Salary < ApplicationRecord
  has_audit_trail only: [ :base_amount, :currency, :effective_date ], event: :audit_event

  validates :employee_id, :effective_date, :base_amount, :currency, presence: true
  validates :employee_id, uniqueness: true
  validates :base_amount, numericality: { greater_than: 0 }, allow_nil: true
  validate :currency_must_be_supported

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

  def currency_must_be_supported
    return if currency.blank?

    errors.add(:currency, "is not supported") unless ExchangeRate.exists?(currency_code: currency)
  end
end
