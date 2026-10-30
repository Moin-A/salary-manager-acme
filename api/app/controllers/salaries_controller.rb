class SalariesController < ApplicationController
  SALARY_FIELDS = [ :id, :base_amount, :currency, :effective_date, :lock_version ].freeze

  def index
    salary = Salary.find_by(employee_id: employee_id)
    audit_logs = salary ? AuditLog.where(entity_type: "Salary", entity_id: salary.id).order(created_at: :desc) : AuditLog.none

    render json: {
      salary: salary&.as_json(only: SALARY_FIELDS),
      history: audit_logs.map { |audit_log| history_entry(audit_log) }
    }
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

  # One past version of the salary: the old values from the audit snapshot,
  # plus what kind of change replaced them, who made it, why and when.
  def history_entry(audit_log)
    audit_log.snapshot.merge(
      "event_type" => audit_log.event_type,
      "note" => audit_log.note,
      "user_id" => audit_log.user_id,
      "changed_at" => audit_log.created_at
    )
  end

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
