require "rails_helper"
require "csv"

RSpec.describe EmployeesCsvExport do
  let(:india) { create(:country, :india) }
  let!(:ada) do
    create(:employee, :with_salary, first_name: "Ada", last_name: "Lovelace", salary_amount: 1500,
      salary_effective_date: Date.new(2026, 4, 1))
  end
  let!(:grace) { create(:employee, first_name: "Grace", last_name: "Hopper", country_id: india.id) }

  let(:rows) { CSV.parse(EmployeesCsvExport.new(Employee.order(:id)).to_csv) }

  it "starts with a header row" do
    expect(rows.first).to eq([ "Employee ID", "First Name", "Last Name", "Country", "Base Amount", "Currency", "Effective Date" ])
  end

  it "writes one row per employee, with their current salary" do
    expect(rows[1]).to eq([ ada.id.to_s, "Ada", "Lovelace", "USA", "1500.0", "USD", "2026-04-01" ])
  end

  it "leaves the salary cells empty for an employee without a salary" do
    expect(rows[2]).to eq([ grace.id.to_s, "Grace", "Hopper", "India", nil, nil, nil ])
  end

  it "keeps a spreadsheet from running a cell as a formula" do
    grace.update!(first_name: "=HYPERLINK(\"http://example.com\")")

    expect(rows[2][1]).to eq("'=HYPERLINK(\"http://example.com\")")
  end
end
