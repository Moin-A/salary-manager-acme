require "rails_helper"

RSpec.describe Employee, type: :model do
  let(:country) { Country.create!(name: "USA", currency_code: "USD", time_zone: "America/New_York") }

  subject(:employee) do
    Employee.new(first_name: "Ada", last_name: "Lovelace", country_id: country.id)
  end

  context "validations" do
    it "is valid with a first name, last name and country" do
      expect(employee).to be_valid
    end

    it "is invalid without a first name" do
      employee.first_name = nil
      expect(employee).to be_invalid
    end

    it "is invalid without a last name" do
      employee.last_name = nil
      expect(employee).to be_invalid
    end

    it "is invalid without a country" do
      employee.country_id = nil
      expect(employee).to be_invalid
    end
  end
end
