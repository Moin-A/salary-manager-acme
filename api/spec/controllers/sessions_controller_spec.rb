require "rails_helper"

RSpec.describe SessionsController, type: :controller do
  let!(:user) { create(:user, login: "hr1") }

  context "create" do
    it "logs in with valid credentials" do
      post :create, params: { login: "hr1", password: "password" }

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body).to include("id" => user.id, "login" => "hr1", "role" => "hr")
      expect(response.parsed_body).not_to have_key("password_digest")
      expect(cookies.encrypted[:user_id]).to eq(user.id)
    end

    it "rejects a wrong password" do
      post :create, params: { login: "hr1", password: "wrong" }

      expect(response).to have_http_status(:unauthorized)
      expect(cookies.encrypted[:user_id]).to be_nil
    end

    it "rejects an unknown login" do
      post :create, params: { login: "nobody", password: "password" }

      expect(response).to have_http_status(:unauthorized)
      expect(cookies.encrypted[:user_id]).to be_nil
    end
  end

  context "destroy" do
    it "logs out" do
      sign_in(user)

      delete :destroy

      expect(response).to have_http_status(:no_content)
      expect(cookies.encrypted[:user_id]).to be_nil
    end
  end
end
