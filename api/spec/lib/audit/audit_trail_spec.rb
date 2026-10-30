require "rails_helper"

RSpec.describe Audit::AuditTrail do
  context "has_audit_trail" do
    it "raises when called more than once" do
      klass = Class.new(ApplicationRecord) do
        has_audit_trail
      end

      expect { klass.has_audit_trail }.to raise_error(Audit::AuditTrail::Error, "has_audit_trail must be called only once")
    end

    it "stores the options it is called with" do
      klass = Class.new(ApplicationRecord) do
        has_audit_trail only: [ :base_amount, :currency ]
      end

      expect(klass.audit_trail_options[:only]).to eq([ "base_amount", "currency" ])
    end

    it "audits updates by default" do
      klass = Class.new(ApplicationRecord) do
        has_audit_trail
      end

      expect(klass.audit_trail_options[:on]).to eq([ :update ])
    end
  end
end
