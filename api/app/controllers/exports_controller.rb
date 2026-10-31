class ExportsController < ApplicationController
  # Exports have no model of their own: authorizes the :export subject.
  authorize_resource class: false

  def employees
    employees = Employee.includes(:country, :salary).order(:last_name, :first_name, :id)

    send_data EmployeesCsvExport.new(employees).to_csv,
      filename: "employees-#{Date.current}.csv",
      type: :csv,
      disposition: "attachment"
  end
end
