# Usage, in a controller spec:
#   it_behaves_like "admin only" do
#     let(:send_request) { get :index }
#   end
RSpec.shared_examples "admin only" do
  context "when the user is not an admin" do
    before { sign_in(create(:user, login: "viewer", role: "viewer")) }

    it "is forbidden" do
      send_request

      expect(response).to have_http_status(:forbidden)
      expect(response.parsed_body).to eq("error" => "You are not allowed to do that")
    end
  end
end
