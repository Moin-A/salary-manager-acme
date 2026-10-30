module Audit
  module AuditTrail
    extend ActiveSupport::Concern

    class Error < StandardError; end

    DEFAULT_OPTIONS = { on: [ :update ] }.freeze

    class_methods do
      def has_audit_trail(options = {})
        if instance_variable_defined?(:@_audit_trail_configured)
          raise Error, "has_audit_trail must be called only once"
        end

        @_audit_trail_configured = true
        merged = DEFAULT_OPTIONS.merge(options)
        audit_trail.setup(merged)
      end

      def audit_trail
        @_audit_trail ||= ModelConfig.new(self)
      end
    end
  end
end
