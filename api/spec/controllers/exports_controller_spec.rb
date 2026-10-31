require "rails_helper"
require "csv"

RSpec.describe ExportsController, type: :controller do
  let(:user) { create(:user) }

  before { sign_in(user) }

  it_behaves_like "admin only" do
    let(:send_request) { get :employees, format: :csv }
  end

  context "employees" do
    let!(:ada) { create(:employee, :with_salary, first_name: "Ada", last_name: "Lovelace") }
    let!(:grace) { create(:employee, first_name: "Grace", last_name: "Hopper") }

    it "downloads every employee as a dated CSV file" do
      get :employees, format: :csv

      expect(response).to have_http_status(:ok)
      expect(response.media_type).to eq("text/csv")
      expect(response.headers["Content-Disposition"]).to include("attachment", "employees-#{Date.current}.csv")
    end

    it "lists the employees by last name, after the header row" do
      get :employees, format: :csv

      last_names = CSV.parse(response.body).drop(1).map { |row| row[2] }
      expect(last_names).to eq([ "Hopper", "Lovelace" ])
    end

    it "rejects a request when nobody is logged in" do
      sign_out

      get :employees, format: :csv

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
