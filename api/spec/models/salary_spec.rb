require "rails_helper"

RSpec.describe Salary, type: :model do
  let(:employee) { create(:employee) }
  let!(:exchange_rate) { create(:exchange_rate) }

  let(:salary) { build(:salary, employee_id: employee.id) }

  context "validations" do
    it "is valid with a base amount, a supported currency and an effective date" do
      expect(salary).to be_valid
    end

    it "is invalid without an effective date" do
      salary.effective_date = nil
      salary.valid?
      expect(salary.errors[:effective_date]).to include("can't be blank")
    end

    it "is invalid without an employee" do
      salary.employee_id = nil
      salary.valid?
      expect(salary.errors[:employee_id]).to include("can't be blank")
    end

    it "is invalid with a nil base amount" do
      salary.base_amount = nil
      salary.valid?
      expect(salary.errors[:base_amount]).to include("can't be blank")
    end

    it "is invalid with a base amount of zero" do
      salary.base_amount = 0
      salary.valid?
      expect(salary.errors[:base_amount]).to include("must be greater than 0")
    end

    it "is invalid with a negative base amount" do
      salary.base_amount = -100
      salary.valid?
      expect(salary.errors[:base_amount]).to include("must be greater than 0")
    end

    it "is invalid with a nil currency" do
      salary.currency = nil
      salary.valid?
      expect(salary.errors[:currency]).to include("can't be blank")
    end

    it "is invalid with a blank currency" do
      salary.currency = ""
      salary.valid?
      expect(salary.errors[:currency]).to include("can't be blank")
    end

    it "is invalid with a currency that has no exchange rate" do
      salary.currency = "ZZZ"
      salary.valid?
      expect(salary.errors[:currency]).to include("is not supported")
    end

    it "is invalid when the employee already has a salary row" do
      create(:salary, employee_id: employee.id)
      salary.valid?
      expect(salary.errors[:employee_id]).to include("has already been taken")
    end
  end

  context "concurrency" do
    it "raises when two salaries for the same employee are inserted at once" do
      create(:salary, employee_id: employee.id)

      # Simulates a second request that already passed the (race-prone)
      # uniqueness validation before the first request committed, by
      # skipping validation and going straight to the database. The
      # unique index on salaries.employee_id is what has to catch it.
      expect {
        salary.save(validate: false)
      }.to raise_error(ActiveRecord::RecordNotUnique)
    end

    it "raises a stale object error when updating based on stale data" do
      created = create(:salary, employee_id: employee.id)

      stale = Salary.find(created.id)
      fresh = Salary.find(created.id)

      fresh.update!(base_amount: 1100)

      expect {
        stale.update!(base_amount: 1200)
      }.to raise_error(ActiveRecord::StaleObjectError)
    end
  end
end
