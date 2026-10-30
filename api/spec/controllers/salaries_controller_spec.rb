require "rails_helper"

RSpec.describe SalariesController, type: :controller do
  let(:employee) { create(:employee) }
  let!(:exchange_rate) { create(:exchange_rate) }
  let!(:salary) { create(:salary, employee_id: employee.id) }
  let(:user) { create(:user) }

  before { sign_in(user) }

  context "when not logged in" do
    before { sign_out }

    it "rejects index" do
      get :index, params: { employee_id: employee.id }
      expect(response).to have_http_status(:unauthorized)
    end

    it "rejects create" do
      new_employee = create(:employee)
      expect {
        post :create, params: { employee_id: new_employee.id, salary: { base_amount: 1000, currency: "USD", effective_date: Date.current } }
      }.not_to change(Salary, :count)
      expect(response).to have_http_status(:unauthorized)
    end

    it "rejects update" do
      patch :update, params: { employee_id: employee.id, id: salary.id, salary: { base_amount: 1500 } }
      expect(response).to have_http_status(:unauthorized)
      expect(salary.reload.base_amount).to eq(1000)
    end
  end

  context "create" do
    let(:new_employee) { create(:employee) }

    it "creates the first salary for the employee" do
      expect {
        post :create, params: { employee_id: new_employee.id, salary: { base_amount: 1000, currency: "USD", effective_date: Date.current } }
      }.to change(Salary, :count).by(1)

      expect(response.parsed_body).to include("employee_id" => new_employee.id, "base_amount" => "1000.0", "currency" => "USD")
    end
  end

  context "update" do
    let(:update_params) do
      { employee_id: employee.id, id: salary.id, salary: { base_amount: 1500, lock_version: salary.lock_version } }
    end

    it "updates the salary" do
      patch :update, params: update_params

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["base_amount"]).to eq("1500.0")
    end

    it "records who made the change" do
      patch :update, params: update_params

      expect(AuditLog.last.user_id).to eq(user.id)
    end

    it "records the note sent with the change" do
      patch :update, params: update_params.merge(note: "Annual raise")

      expect(AuditLog.last.note).to eq("Annual raise")
    end

    context "optimistic locking" do
      it "returns the incremented lock_version after an update" do
        patch :update, params: update_params

        expect(response).to have_http_status(:ok)
        expect(response.parsed_body["lock_version"]).to eq(salary.lock_version + 1)
      end

      it "rejects an update based on a stale lock_version" do
        stale_version = salary.lock_version
        Salary.find(salary.id).update!(base_amount: 1100)

        patch :update, params: update_params.deep_merge(salary: { lock_version: stale_version })

        expect(response).to have_http_status(:conflict)
        expect(response.parsed_body).to include("error")
        expect(salary.reload.base_amount).to eq(1100)
      end

      it "rejects an update without a lock_version" do
        patch :update, params: update_params.merge(salary: { base_amount: 1500 })

        expect(response).to have_http_status(:bad_request)
        expect(salary.reload.base_amount).to eq(1000)
      end
    end
  end

  context "index" do
    let!(:audit_log) do
      create(:audit_log, entity_id: salary.id, user_id: user.id, note: "Annual review",
        snapshot: { "base_amount" => "800.0", "currency" => "USD", "effective_date" => 1.day.ago.to_date.to_s })
    end

    let(:expected_salary) do
      { "id" => salary.id, "base_amount" => "1000.0", "currency" => "USD", "lock_version" => salary.lock_version }
    end
    let(:expected_history_entry) do
      {
        "base_amount" => "800.0",
        "currency" => "USD",
        "event_type" => "salary_changed",
        "note" => "Annual review",
        "user_id" => user.id,
        "changed_at" => audit_log.created_at.as_json
      }
    end

    it "returns the current salary with its lock_version" do
      get :index, params: { employee_id: employee.id }

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["salary"]).to include(expected_salary)
    end

    it "returns the history of old values from the audit log" do
      get :index, params: { employee_id: employee.id }

      expect(response.parsed_body["history"]).to contain_exactly(a_hash_including(expected_history_entry))
    end

    it "returns no salary and no history for an employee without a salary" do
      get :index, params: { employee_id: create(:employee).id }

      expect(response.parsed_body).to eq("salary" => nil, "history" => [])
    end
  end
end
