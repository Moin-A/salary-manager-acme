require "rails_helper"

RSpec.describe Salary, type: :model do
  let(:country) { Country.create!(name: "USA", currency_code: "USD", time_zone: "America/New_York") }
  let(:employee) { Employee.create!(first_name: "Ada", last_name: "Lovelace", country_id: country.id) }

  before do
    ExchangeRate.create!(currency_code: "USD", rate_to_usd: 1, rate_date: Date.current)
  end

  subject(:salary) do
    Salary.new(employee_id: employee.id, base_amount: 1000, currency: "USD", effective_date: Date.current)
  end

  context "validations" do
    it "is valid with a base amount, a supported currency and an effective date" do
      expect(salary).to be_valid
    end

    it "is invalid without an effective date" do
      salary.effective_date = nil
      expect(salary).to be_invalid
    end

    it "is invalid with a base amount of zero" do
      salary.base_amount = 0
      expect(salary).to be_invalid
    end

    it "is invalid with a negative base amount" do
      salary.base_amount = -100
      expect(salary).to be_invalid
    end

    it "is invalid with a currency that has no exchange rate" do
      salary.currency = "ZZZ"
      expect(salary).to be_invalid
    end

    it "is invalid when the employee already has a salary row" do
      Salary.create!(employee_id: employee.id, base_amount: 500, currency: "USD", effective_date: Date.current)
      expect(salary).to be_invalid
    end
  end
end
