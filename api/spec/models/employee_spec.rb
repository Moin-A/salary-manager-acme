require "rails_helper"

RSpec.describe Employee, type: :model do
  let(:country) { Country.create!(name: "USA", currency_code: "USD", time_zone: "America/New_York") }

  let(:employee) do
    Employee.new(first_name: "Ada", last_name: "Lovelace", country_id: country.id)
  end

  context "validations" do
    it "is valid with a first name, last name and country" do
      expect(employee).to be_valid
    end

    it "is invalid without a first name" do
      employee.first_name = nil
      employee.valid?
      expect(employee.errors[:first_name]).to include("can't be blank")
    end

    it "is invalid without a last name" do
      employee.last_name = nil
      employee.valid?
      expect(employee.errors[:last_name]).to include("can't be blank")
    end

    it "is invalid without a country" do
      employee.country_id = nil
      employee.valid?
      expect(employee.errors[:country_id]).to include("can't be blank")
    end
  end
end
