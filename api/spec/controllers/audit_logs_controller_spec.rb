require "rails_helper"

RSpec.describe AuditLogsController, type: :controller do
  let(:user) { create(:user, login: "hr1") }

  before { sign_in(user) }

  context "index" do
    let!(:exchange_rate) { create(:exchange_rate) }
    let(:ada) { create(:employee, first_name: "Ada", last_name: "Lovelace") }
    let(:grace) { create(:employee, first_name: "Grace", last_name: "Hopper") }
    let!(:ada_salary) { create(:salary, employee_id: ada.id, base_amount: 1500, effective_date: Date.new(2026, 7, 1)) }
    let!(:grace_salary) { create(:salary, employee_id: grace.id, base_amount: 2600, effective_date: Date.new(2026, 6, 1)) }

    # Ada:   1000 -> 1200 (Promotion, 5 days ago), then 1200 -> 1500 (Annual review, 2 days ago)
    # Grace: 2400 -> 2600 (Merit increase, 3 days ago)
    # Newest first: Annual review, Merit increase, Promotion.
    let!(:promotion) do
      create(:audit_log, entity_id: ada_salary.id, user_id: user.id, note: "Promotion", created_at: 5.days.ago,
        snapshot: { "base_amount" => "1000.0", "currency" => "USD", "effective_date" => "2025-07-01" })
    end
    let!(:merit_increase) do
      create(:audit_log, entity_id: grace_salary.id, user_id: user.id, note: "Merit increase", created_at: 3.days.ago,
        snapshot: { "base_amount" => "2400.0", "currency" => "USD", "effective_date" => "2025-06-01" })
    end
    let!(:annual_review) do
      create(:audit_log, entity_id: ada_salary.id, user_id: user.id, note: "Annual review", created_at: 2.days.ago,
        snapshot: { "base_amount" => "1200.0", "currency" => "USD", "effective_date" => "2026-01-01" })
    end

    let(:listed_logs) { response.parsed_body["audit_logs"] }
    let(:listed_log) { ->(audit_log) { listed_logs.find { |log| log["id"] == audit_log.id } } }

    it "lists audit logs newest first, across employees" do
      get :index

      expect(listed_logs.map { |log| log["note"] }).to eq([ "Annual review", "Merit increase", "Promotion" ])
    end

    it "includes who made the change, what changed and why" do
      get :index

      expect(listed_log.call(annual_review)).to include(
        "user" => { "id" => user.id, "login" => "hr1" },
        "event_type" => "salary_changed",
        "entity_type" => "Salary",
        "entity_id" => ada_salary.id,
        "note" => "Annual review",
        "created_at" => annual_review.created_at.as_json
      )
    end

    it "takes the new values from the salary's next change" do
      get :index

      expect(listed_log.call(promotion)["old_values"]).to include("base_amount" => "1000.0")
      expect(listed_log.call(promotion)["new_values"]).to include("base_amount" => "1200.0", "effective_date" => "2026-01-01")
    end

    it "takes the new values from the current salary for its latest change" do
      get :index

      expect(listed_log.call(annual_review)["new_values"]).to include("base_amount" => "1500.0", "effective_date" => "2026-07-01")
      expect(listed_log.call(merit_increase)["new_values"]).to include("base_amount" => "2600.0", "effective_date" => "2026-06-01")
    end

    it "finds the new values even when the next change is on another page" do
      get :index, params: { page: 2, per_page: 2 }

      expect(listed_logs.map { |log| log["note"] }).to eq([ "Promotion" ])
      expect(listed_log.call(promotion)["new_values"]).to include("base_amount" => "1200.0")
    end

    it "returns one page with the pagination details" do
      get :index, params: { per_page: 1 }

      expect(listed_logs.size).to eq(1)
      expect(response.parsed_body["pagination"]).to eq(
        "page" => 1, "per_page" => 1, "total_count" => 3, "total_pages" => 3
      )
    end

    it "rejects a request when nobody is logged in" do
      sign_out

      get :index

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
