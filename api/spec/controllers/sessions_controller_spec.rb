require "rails_helper"

RSpec.describe SessionsController, type: :controller do
  let!(:user) { create(:user, login: "hr1") }

  context "create" do
    it "returns a session token and the user for valid credentials" do
      post :create, params: { login: "hr1", password: "password" }

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["user"]).to include("id" => user.id, "login" => "hr1", "role" => "hr")
      expect(response.parsed_body["user"]).not_to have_key("password_digest")
      expect(User.find_signed(response.parsed_body["token"], purpose: :session)).to eq(user)
    end

    it "rejects a wrong password" do
      post :create, params: { login: "hr1", password: "wrong" }

      expect(response).to have_http_status(:unauthorized)
      expect(response.parsed_body).not_to have_key("token")
    end

    it "rejects an unknown login" do
      post :create, params: { login: "nobody", password: "password" }

      expect(response).to have_http_status(:unauthorized)
      expect(response.parsed_body).not_to have_key("token")
    end
  end

  context "show" do
    it "returns the current user for a valid token" do
      sign_in(user)

      get :show

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body).to include("id" => user.id, "login" => "hr1", "role" => "hr")
    end

    it "rejects a missing token" do
      get :show

      expect(response).to have_http_status(:unauthorized)
    end

    it "rejects an invalid token" do
      request.headers["Authorization"] = "Bearer not-a-real-token"

      get :show

      expect(response).to have_http_status(:unauthorized)
    end

    it "rejects a token older than 12 hours" do
      post :create, params: { login: "hr1", password: "password" }
      token = response.parsed_body["token"]

      travel 13.hours do
        request.headers["Authorization"] = "Bearer #{token}"
        get :show
      end

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
