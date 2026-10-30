module Audit
  module AuditTrail
    extend ActiveSupport::Concern

    class Error < StandardError; end

    class_methods do
      def has_audit_trail
        if instance_variable_defined?(:@_audit_trail_configured)
          raise Error, "has_audit_trail must be called only once"
        end

        @_audit_trail_configured = true
      end
    end
  end
end
