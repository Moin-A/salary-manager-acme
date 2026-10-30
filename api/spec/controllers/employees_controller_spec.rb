require "rails_helper"

RSpec.describe EmployeesController, type: :controller do
  let(:country) { create(:country) }
  let(:params) { { employee: { first_name: "Ada", last_name: "Lovelace", country_id: country.id } } }
  let(:invalid_params) { { employee: { first_name: "", last_name: "", country_id: nil } } }
  let(:user) { create(:user) }

  before { sign_in(user) }

  context "when not logged in" do
    let(:employee) { create(:employee, country_id: country.id) }

    before { sign_out }

    it "rejects index" do
      get :index
      expect(response).to have_http_status(:unauthorized)
    end

    it "rejects show" do
      get :show, params: { id: employee.id }
      expect(response).to have_http_status(:unauthorized)
    end

    it "rejects create" do
      expect {
        post :create, params: params
      }.not_to change(Employee, :count)
      expect(response).to have_http_status(:unauthorized)
    end

    it "rejects update" do
      patch :update, params: { id: employee.id, employee: { first_name: "Grace" } }
      expect(response).to have_http_status(:unauthorized)
      expect(employee.reload.first_name).to eq("Ada")
    end
  end

  context "create" do
    it "creates an employee" do
      expect {
        post :create, params: params
      }.to change(Employee, :count).by(1)

      expect(response.parsed_body).to include("first_name" => "Ada", "last_name" => "Lovelace", "country_id" => country.id)
    end

    it "does not create an employee when all validations fail" do
      expect {
        post :create, params: invalid_params
      }.not_to change(Employee, :count)

      expect(response).to have_http_status(:unprocessable_content)
    end
  end

  context "index" do
    let!(:other_country) { create(:country, :india) }
    let!(:employee_in_usa) { create(:employee, country_id: country.id) }
    let!(:employee_in_india) { create(:employee, first_name: "Grace", last_name: "Hopper", country_id: other_country.id) }

    # Lazy, so they read the response of the request made inside each example.
    let(:listed_employee_in_usa) { response.parsed_body["employees"].find { |employee| employee["id"] == employee_in_usa.id } }
    let(:listed_employee_in_india) { response.parsed_body["employees"].find { |employee| employee["id"] == employee_in_india.id } }

    it "returns all employees" do
      get :index

      expect(response.parsed_body["employees"].size).to eq(2)
      expect(response.parsed_body["employees"]).to include(
        a_hash_including("first_name" => "Ada", "country_id" => country.id),
        a_hash_including("first_name" => "Grace", "country_id" => other_country.id)
      )
    end

    it "includes each employee's country and current salary" do
      create(:exchange_rate)
      create(:salary, employee_id: employee_in_usa.id, base_amount: 1000, effective_date: Date.new(2026, 1, 1))

      get :index

      expect(listed_employee_in_usa["country"]).to include("name" => country.name, "currency_code" => country.currency_code)
      expect(listed_employee_in_usa["salary"]).to include("base_amount" => "1000.0", "currency" => "USD", "effective_date" => "2026-01-01")
    end

    it "returns a null salary for an employee who has none" do
      get :index

      expect(listed_employee_in_india).to include("salary" => nil)
    end

    it "filters employees by country" do
      get :index, params: { country_id: country.id }

      expect(response.parsed_body["employees"].size).to eq(1)
      expect(response.parsed_body["employees"]).to include(
        a_hash_including("first_name" => "Ada", "country_id" => country.id)
      )
    end

    context "search" do
      let(:listed_names) { response.parsed_body["employees"].map { |employee| "#{employee["first_name"]} #{employee["last_name"]}" } }

      it "matches part of a first or last name, ignoring case" do
        get :index, params: { q: "HOPP" }

        expect(listed_names).to eq([ "Grace Hopper" ])
      end

      it "matches a full name" do
        get :index, params: { q: "ada love" }

        expect(listed_names).to eq([ "Ada Lovelace" ])
      end
    end

    context "pagination" do
      before { create(:employee, first_name: "Linus", last_name: "Torvalds", country_id: country.id) }

      it "returns one page of employees with the pagination details" do
        get :index, params: { per_page: 2 }

        expect(response.parsed_body["employees"].size).to eq(2)
        expect(response.parsed_body["pagination"]).to eq(
          "page" => 1, "per_page" => 2, "total_count" => 3, "total_pages" => 2
        )
      end

      it "returns the requested page" do
        get :index, params: { page: 2, per_page: 2 }

        expect(response.parsed_body["employees"].size).to eq(1)
        expect(response.parsed_body["pagination"]["page"]).to eq(2)
      end

      it "counts only the filtered employees" do
        get :index, params: { country_id: country.id, per_page: 2 }

        expect(response.parsed_body["pagination"]["total_count"]).to eq(2)
      end
    end
  end

  context "update" do
    let!(:employee) { create(:employee, country_id: country.id) }

    it "updates the employee" do
      patch :update, params: { id: employee.id, employee: { first_name: "Grace" } }

      expect(employee.reload.first_name).to eq("Grace")
    end
  end

  context "show" do
    let!(:employee) { create(:employee, country_id: country.id) }

    it "returns the employee" do
      get :show, params: { id: employee.id }

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body).to include("id" => employee.id, "first_name" => "Ada", "last_name" => "Lovelace", "country_id" => country.id)
      expect(response.parsed_body).not_to have_key("salary")
    end
  end
end
