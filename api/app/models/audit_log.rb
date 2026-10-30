class AuditLog < ApplicationRecord
  # Optional: changes made outside a request (console, seeds) have no user.
  belongs_to :user, optional: true

  # An audit row only stores the values from before a change; see
  # AuditLog::NewValues for how the values that replaced them are found.
  # Returns { audit_log_id => values } for a page of audit logs.
  def self.new_values_for(audit_logs)
    audit_logs.group_by(&:entity_type).reduce({}) do |new_values, (entity_type, logs)|
      new_values.merge(NewValues.new(entity_type, logs).to_h)
    end
  end
end
