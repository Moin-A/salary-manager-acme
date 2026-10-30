require "rails_helper"

RSpec.describe AuditLogsController, type: :controller do
  let(:user) { create(:user, login: "hr1") }

  before { sign_in(user) }

  context "index" do
    let!(:exchange_rate) { create(:exchange_rate) }
    let!(:salary) { create(:salary, base_amount: 1500) }

    # Two changes to one salary: 1000 -> 1200 ("Promotion"), then 1200 -> 1500 ("Annual review").
    let!(:promotion) do
      create(:audit_log, entity_id: salary.id, user_id: user.id, note: "Promotion", created_at: 2.days.ago,
        snapshot: { "base_amount" => "1000.0", "currency" => "USD", "effective_date" => salary.effective_date.to_s })
    end
    let!(:annual_review) do
      create(:audit_log, entity_id: salary.id, user_id: user.id, note: "Annual review", created_at: 1.day.ago,
        snapshot: { "base_amount" => "1200.0", "currency" => "USD", "effective_date" => salary.effective_date.to_s })
    end

    let(:listed_logs) { response.parsed_body["audit_logs"] }

    it "lists audit logs newest first" do
      get :index

      expect(listed_logs.map { |log| log["id"] }).to eq([ annual_review.id, promotion.id ])
    end

    it "includes who made the change, what changed and why" do
      get :index

      expect(listed_logs.first).to include(
        "user" => { "id" => user.id, "login" => "hr1" },
        "event_type" => "salary_changed",
        "entity_type" => "Salary",
        "entity_id" => salary.id,
        "note" => "Annual review",
        "created_at" => annual_review.created_at.as_json
      )
    end

    it "shows the old values and the values that replaced them" do
      get :index

      expect(listed_logs.first["old_values"]).to include("base_amount" => "1200.0")
      expect(listed_logs.first["new_values"]).to include("base_amount" => "1500.0")
      expect(listed_logs.last["old_values"]).to include("base_amount" => "1000.0")
      expect(listed_logs.last["new_values"]).to include("base_amount" => "1200.0")
    end

    it "returns one page with the pagination details" do
      get :index, params: { per_page: 1 }

      expect(listed_logs.size).to eq(1)
      expect(response.parsed_body["pagination"]).to eq(
        "page" => 1, "per_page" => 1, "total_count" => 2, "total_pages" => 2
      )
    end

    it "rejects a request when nobody is logged in" do
      sign_out

      get :index

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
