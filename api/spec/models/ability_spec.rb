require "rails_helper"

RSpec.describe Ability do
  context "for an admin" do
    let(:ability) { Ability.new(build(:user, role: "admin")) }

    it "can manage everything" do
      expect(ability.can?(:manage, :all)).to be(true)
    end
  end

  context "for any other user" do
    let(:ability) { Ability.new(build(:user, role: "viewer")) }

    it "can't read employees" do
      expect(ability.can?(:read, Employee)).to be(false)
    end

    it "can't change salaries" do
      expect(ability.can?(:update, Salary)).to be(false)
    end
  end
end
