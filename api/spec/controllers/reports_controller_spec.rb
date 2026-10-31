require "rails_helper"

RSpec.describe ReportsController, type: :controller do
  let(:user) { create(:user) }

  before { sign_in(user) }

  context "salaries_by_country" do
    let(:current_month) { Date.current.strftime("%Y-%m") }
    let(:previous_month) { 1.month.ago.strftime("%Y-%m") }

    let(:usa) { create(:country) }
    let(:india) { create(:country, :india) }
    let(:four_months_ago) { 4.months.ago.beginning_of_month.to_date }
    let(:this_month) { Date.current.beginning_of_month }
    let(:last_month) { 1.month.ago.beginning_of_month.to_date }
    let(:next_month) { 1.month.from_now.beginning_of_month.to_date }

    # USA: 1,000 / 2,000 / 6,000 USD.
    # India: 50,000 / 100,000 / 150,000 INR = 600 / 1,200 / 1,800 USD (the factory's INR rate is 0.012).
    # All in effect since four months ago, so they count in this month and last month.
    let!(:usa_salary) do
      create(:employee, :with_salary, country_id: usa.id, salary_amount: 1000, salary_currency: "USD", salary_effective_date: four_months_ago).salary
    end

    before do
      create(:employee, :with_salary, country_id: usa.id, salary_amount: 2000, salary_currency: "USD", salary_effective_date: four_months_ago)
      create(:employee, :with_salary, country_id: usa.id, salary_amount: 6000, salary_currency: "USD", salary_effective_date: four_months_ago)

      create(:employee, :with_salary, country_id: india.id, salary_amount: 50_000, salary_currency: "INR", salary_effective_date: four_months_ago)
      create(:employee, :with_salary, country_id: india.id, salary_amount: 100_000, salary_currency: "INR", salary_effective_date: four_months_ago)
      create(:employee, :with_salary, country_id: india.id, salary_amount: 150_000, salary_currency: "INR", salary_effective_date: four_months_ago)
    end

    let(:expected_countries) do
      [
        { "country" => "India", "currency" => "INR",
          "average" => 1200.0, "median" => 1200.0, "min" => 600.0, "max" => 1800.0, "employee_count" => 3 },
        { "country" => "USA", "currency" => "USD",
          "average" => 3000.0, "median" => 2000.0, "min" => 1000.0, "max" => 6000.0, "employee_count" => 3 }
      ]
    end

    let(:usa_average) { response.parsed_body["countries"].find { |row| row["country"] == "USA" }["average"] }

    it "lists each country's average, median, minimum, maximum and employee count in USD" do
      get :salaries_by_country, params: { month: current_month }

      expect(response.parsed_body["countries"]).to eq(expected_countries)
    end

    # A typo fixed on the same day: both versions start this month, so the
    # effective date alone can't tell which one is in effect.
    context "when a salary is corrected keeping the same effective date" do
      before do
        usa_salary.update!(base_amount: 7000, effective_date: this_month)
        usa_salary.update!(base_amount: 10_000, effective_date: this_month)
      end

      it "uses the corrected salary" do
        get :salaries_by_country, params: { month: current_month }

        expect(usa_average).to eq(6000.0)
      end
    end

    # The 1,000 USA salary changes over the months. Each change moves the old
    # amount into the audit history; the salaries row keeps the latest.
    # With the other two USA salaries (8,000 in total), the USA average is
    # 5,000 when it is 7,000 and 6,000 when it is 10,000.
    context "when a salary changes over the months" do
      # Common history: 1,000 four months ago, 4,000 three months ago, 5,000 two months ago.
      before do
        usa_salary.update!(base_amount: 4000, effective_date: 3.months.ago.beginning_of_month.to_date)
        usa_salary.update!(base_amount: 5000, effective_date: 2.months.ago.beginning_of_month.to_date)
      end

      context "and the latest salary takes effect this month" do
        before do
          usa_salary.update!(base_amount: 7000, effective_date: last_month)
          usa_salary.update!(base_amount: 10_000, effective_date: this_month)
        end

        it "uses this month's salary for this month" do
          get :salaries_by_country, params: { month: current_month }

          expect(usa_average).to eq(6000.0)
        end

        it "uses last month's salary, from the history, for last month" do
          get :salaries_by_country, params: { month: previous_month }

          expect(usa_average).to eq(5000.0)
        end
      end

      context "and the latest salary takes effect next month" do
        before do
          usa_salary.update!(base_amount: 7000, effective_date: last_month)
          usa_salary.update!(base_amount: 10_000, effective_date: next_month)
        end

        it "uses last month's salary, from the history, for this month" do
          get :salaries_by_country, params: { month: current_month }

          expect(usa_average).to eq(5000.0)
        end

        it "uses last month's salary, from the history, for last month" do
          get :salaries_by_country, params: { month: previous_month }

          expect(usa_average).to eq(5000.0)
        end
      end

      context "and the latest salary took effect last month" do
        before { usa_salary.update!(base_amount: 10_000, effective_date: last_month) }

        it "uses last month's salary for this month" do
          get :salaries_by_country, params: { month: current_month }

          expect(usa_average).to eq(6000.0)
        end

        it "uses last month's salary for last month" do
          get :salaries_by_country, params: { month: previous_month }

          expect(usa_average).to eq(6000.0)
        end
      end
    end
  end
end
