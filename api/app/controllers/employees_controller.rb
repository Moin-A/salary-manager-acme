class EmployeesController < ApplicationController
  def index
    employees = Employee.all
    employees = employees.where(country_id: filter_params[:country_id]) if filter_params[:country_id].present?
    render json: employees
  end

  def show
    employee = Employee.find(employee_id)
    render json: employee
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
    employee = Employee.find(employee_id)
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

  def filter_params
    params.permit(:country_id)
  end

  def employee_id
    params.require(:id)
  end
end
