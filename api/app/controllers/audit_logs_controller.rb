class AuditLogsController < ApplicationController
  include Paginated

  def index
    audit_logs, pagination = paginate(AuditLog.includes(:user).order(created_at: :desc, id: :desc))
    new_values = AuditLog.new_values_for(audit_logs)

    render json: {
      audit_logs: audit_logs.map { |audit_log| audit_log_json(audit_log, new_values[audit_log.id]) },
      pagination: pagination
    }
  end

  private

  def audit_log_json(audit_log, new_values)
    {
      id: audit_log.id,
      user: audit_log.user&.as_json(only: [ :id, :login ]),
      event_type: audit_log.event_type,
      entity_type: audit_log.entity_type,
      entity_id: audit_log.entity_id,
      old_values: audit_log.snapshot,
      new_values: new_values,
      note: audit_log.note,
      created_at: audit_log.created_at
    }
  end
end
