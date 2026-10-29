class EmployeesController < ApplicationController
  def index
    employees = Employee.all
    employees = employees.where(country_id: params[:country_id]) if params[:country_id].present?
    render json: employees
  end

  def show
    employee = Employee.find(params[:id])
    salary = Salary.find_by(employee_id: employee.id)
    render json: employee.as_json.merge(salary: salary&.as_json)
  end

  def create
    employee = Employee.new(employee_params)
    if employee.save
      render json: employee, status: :created
    else
      render json: { errors: employee.errors }, status: :unprocessable_content
    end
  end

  def update
    employee = Employee.find(params[:id])
    if employee.update(employee_params)
      render json: employee
    else
      render json: { errors: employee.errors }, status: :unprocessable_content
    end
  end

  private

  def employee_params
    params.require(:employee).permit(:first_name, :last_name, :country_id)
  end
end
