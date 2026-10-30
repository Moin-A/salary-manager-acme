# Works out what replaced the old values on a page of audit logs for one
# entity type: the snapshot on the record's next log, or the record's current
# values when the log is its latest change.
class AuditLog::NewValues
  def initialize(entity_type, audit_logs)
    @entity_type = entity_type
    @audit_logs = audit_logs
  end

  # { audit_log_id => new values }
  def to_h
    audit_logs.to_h { |log| [ log.id, new_values_for(log) ] }
  end

  private

  attr_reader :entity_type, :audit_logs

  def new_values_for(log)
    next_log = logs_created_after(log).first
    next_log ? next_log.snapshot : current_values(records[log.entity_id])
  end

  # The record's logs that came after log, oldest first.
  def logs_created_after(log)
    entire_history[log.entity_id].drop_while { |other| other.id != log.id }.drop(1)
  end

  # Getters below are memoized: each runs its query once per page, not per log.
  def entity_ids
    @entity_ids ||= audit_logs.map(&:entity_id).uniq
  end

  # Every log for the page's records, including ones on other pages.
  def entire_history
    @entire_history ||= AuditLog.where(entity_type: entity_type, entity_id: entity_ids)
      .order(:created_at, :id)
      .group_by(&:entity_id)
  end

  def records
    @records ||= entity_type.constantize.where(id: entity_ids).index_by(&:id)
  end

  def current_values(record)
    record&.slice(*record.audit_trail_options[:only])&.as_json
  end
end
