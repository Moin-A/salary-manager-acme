require "rails_helper"

RSpec.describe EmployeesController, type: :controller do
  let(:country) { create(:country) }
  let(:params) { { employee: { first_name: "Ada", last_name: "Lovelace", country_id: country.id } } }
  let(:invalid_params) { { employee: { first_name: "", last_name: "", country_id: nil } } }

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

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  context "index" do
    let!(:other_country) { create(:country, :india) }
    let!(:employee_in_usa) { create(:employee, country_id: country.id) }
    let!(:employee_in_india) { create(:employee, first_name: "Grace", last_name: "Hopper", country_id: other_country.id) }

    it "returns all employees" do
      get :index

      expect(response.parsed_body.size).to eq(2)
      expect(response.parsed_body).to include(
        a_hash_including("first_name" => "Ada", "country_id" => country.id),
        a_hash_including("first_name" => "Grace", "country_id" => other_country.id)
      )
    end

    it "filters employees by country" do
      get :index, params: { country_id: country.id }

      expect(response.parsed_body.size).to eq(1)
      expect(response.parsed_body).to include(
        a_hash_including("first_name" => "Ada", "country_id" => country.id)
      )
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
    let!(:exchange_rate) { create(:exchange_rate) }
    let!(:salary) { create(:salary, employee_id: employee.id) }

    it "returns the employee with their current salary" do
      get :show, params: { id: employee.id }

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["first_name"]).to eq("Ada")
      expect(response.parsed_body["salary"]["base_amount"]).to eq("1000.0")
    end
  end
end
