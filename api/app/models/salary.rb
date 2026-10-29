class Salary < ApplicationRecord
  validates :employee_id, :effective_date, :base_amount, :currency, presence: true
  validates :employee_id, uniqueness: true
  validates :base_amount, numericality: { greater_than: 0 }, allow_nil: true
  validate :currency_must_be_supported

  private

  def currency_must_be_supported
    return if currency.blank?

    errors.add(:currency, "is not supported") unless ExchangeRate.exists?(currency_code: currency)
  end
end
