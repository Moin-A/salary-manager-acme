require "rails_helper"

RSpec.describe CountriesController, type: :controller do
  let(:user) { create(:user) }

  before { sign_in(user) }

  it_behaves_like "admin only" do
    let(:send_request) { get :index }
  end

  context "index" do
    let!(:usa) { create(:country) }
    let!(:india) { create(:country, :india) }

    it "returns the countries ordered by name" do
      get :index

      expect(response.parsed_body).to eq([
        { "id" => india.id, "name" => india.name, "currency_code" => india.currency_code },
        { "id" => usa.id, "name" => usa.name, "currency_code" => usa.currency_code }
      ])
    end

    it "rejects a request when nobody is logged in" do
      sign_out

      get :index

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
