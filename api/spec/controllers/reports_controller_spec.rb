require "rails_helper"

RSpec.describe ReportsController, type: :controller do
  let(:user) { create(:user) }

  before { sign_in(user) }

  context "salaries_by_country" do
    let(:month) { Date.current.strftime("%Y-%m") }

    # Rates come first: the salary factory would otherwise create a rate of 1 for INR.
    let!(:usd_rate) { create(:exchange_rate, currency_code: "USD", rate_to_usd: 1) }
    let!(:inr_rate) { create(:exchange_rate, currency_code: "INR", rate_to_usd: 0.012) }

    # USA: 1,000 / 2,000 / 6,000 USD.
    # India: 50,000 / 100,000 / 150,000 INR = 600 / 1,200 / 1,800 USD.
    let!(:usa) { create(:country, :with_salaried_employees, salary_amounts: [ 1000, 2000, 6000 ]) }
    let!(:india) { create(:country, :india, :with_salaried_employees, salary_amounts: [ 50_000, 100_000, 150_000 ]) }

    let(:expected_countries) do
      [
        { "country" => "India", "currency" => "INR",
          "average" => 1200.0, "median" => 1200.0, "min" => 600.0, "max" => 1800.0, "employee_count" => 3 },
        { "country" => "USA", "currency" => "USD",
          "average" => 3000.0, "median" => 2000.0, "min" => 1000.0, "max" => 6000.0, "employee_count" => 3 }
      ]
    end

    it "responds with the requested month in USD" do
      get :salaries_by_country, params: { month: month }

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body).to include("month" => month, "currency" => "USD")
    end

    it "lists each country's average, median, minimum, maximum and employee count in USD" do
      get :salaries_by_country, params: { month: month }

      expect(response.parsed_body["countries"]).to eq(expected_countries)
    end
  end
end
