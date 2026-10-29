class SalariesController < ApplicationController
  def index
    current = Salary.find_by(employee_id: employee_id)
    history = AuditLog.where(entity_type: "Salary", entity_id: current&.id).map(&:snapshot)
    render json: [ current&.as_json, *history ].compact
  end

  def create
    salary = Salary.new(salary_params.merge(employee_id: employee_id))
    if salary.save
      render json: salary, status: :created
    else
      render json: { errors: salary.errors }, status: :unprocessable_content
    end
  end

  def update
    salary = Salary.find(salary_id)
    if salary.update(salary_params)
      render json: salary
    else
      render json: { errors: salary.errors }, status: :unprocessable_content
    end
  end

  private

  def salary_params
    params.require(:salary).permit(:base_amount, :currency, :effective_date)
  end

  def employee_id
    params.require(:employee_id)
  end

  def salary_id
    params.require(:id)
  end
end
