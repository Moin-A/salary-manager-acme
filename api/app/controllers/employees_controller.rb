class EmployeesController < ApplicationController
  DEFAULT_PER_PAGE = 20
  MAX_PER_PAGE = 100
  COUNTRY_FIELDS = [ :id, :name, :currency_code ].freeze
  SALARY_FIELDS = [ :id, :base_amount, :currency, :effective_date, :lock_version ].freeze

  def index
    employees = Employee.order(:last_name, :first_name, :id)
    employees = employees.where(country_id: filter_params[:country_id]) if filter_params[:country_id].present?
    total_count = employees.count
    page_of_employees = employees.includes(:country, :salary).limit(per_page).offset((page - 1) * per_page)

    render json: {
      employees: page_of_employees.map { |employee| list_item_json(employee) },
      pagination: {
        page: page,
        per_page: per_page,
        total_count: total_count,
        total_pages: (total_count.to_f / per_page).ceil
      }
    }
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

  def list_item_json(employee)
    json = employee.as_json(include: { country: { only: COUNTRY_FIELDS }, salary: { only: SALARY_FIELDS } })
    # as_json(include:) leaves out a has_one that is nil; the list needs "salary": null.
    json.merge!("salary" => nil) if employee.salary.nil?
    json
  end

  def employee_params
    params.require(:employee).permit(:first_name, :last_name, :country_id)
  end

  def filter_params
    params.permit(:country_id, :page, :per_page)
  end

  def page
    [ filter_params[:page].to_i, 1 ].max
  end

  # Capped so a single request can't pull all 10,000 employees.
  def per_page
    requested = filter_params[:per_page].to_i
    requested.positive? ? [ requested, MAX_PER_PAGE ].min : DEFAULT_PER_PAGE
  end

  def employee_id
    params.require(:id)
  end
end
