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
    salary.audit_note = note
    if salary.update(salary_update_params)
      render json: salary
    else
      render json: { errors: salary.errors }, status: :unprocessable_content
    end
  end

  private

  def salary_params
    params.require(:salary).permit(:base_amount, :currency, :effective_date)
  end

  # lock_version is the version the client read; Rails compares it on save
  # and raises StaleObjectError if someone else saved in between. Required,
  # since leaving it out would skip the check.
  def salary_update_params
    attributes = params.require(:salary).permit(:base_amount, :currency, :effective_date, :lock_version)
    attributes.require(:lock_version)
    attributes
  end

  def employee_id
    params.require(:employee_id)
  end

  def salary_id
    params.require(:id)
  end

  def note
    params.fetch(:note, nil)
  end
end
