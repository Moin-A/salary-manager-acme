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
    it "updates the salary" do
      patch :update, params: { employee_id: employee.id, id: salary.id, salary: { base_amount: 1500 } }

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["base_amount"]).to eq("1500.0")
    end
  end

  context "index" do
    let!(:audit_log) do
      create(:audit_log, entity_id: salary.id, snapshot: { "base_amount" => "800.0", "currency" => "USD", "effective_date" => 1.day.ago.to_date.to_s })
    end

    it "returns the current salary and the historical one from the audit log" do
      get :index, params: { employee_id: employee.id }

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body.size).to eq(2)
      expect(response.parsed_body).to include(
        a_hash_including("base_amount" => "1000.0"),
        a_hash_including("base_amount" => "800.0")
      )
    end
  end
end
