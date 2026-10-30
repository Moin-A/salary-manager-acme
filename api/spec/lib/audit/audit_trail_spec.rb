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

  context "on update" do
    before do
      stub_const("AuditedSalary", Class.new(ApplicationRecord) do
        self.table_name = "salaries"
        has_audit_trail only: [ :base_amount, :currency ]
      end)
    end

    let(:record) { AuditedSalary.find(create(:salary, base_amount: 1000).id) }

    it "writes an audit log with the previous values of the audited columns" do
      expect { record.update!(base_amount: 1500) }.to change(AuditLog, :count).by(1)

      expect(AuditLog.last).to have_attributes(
        entity_type: "AuditedSalary",
        entity_id: record.id,
        snapshot: { "base_amount" => "1000.0", "currency" => "USD" }
      )
    end
  end

  context "event type" do
    before do
      stub_const("AuditedSalary", Class.new(ApplicationRecord) do
        self.table_name = "salaries"
        has_audit_trail only: [ :base_amount ], event: :audit_event

        def audit_event
          saved_change_to_base_amount? ? "amount_changed" : "other_change"
        end
      end)
    end

    let(:record) { AuditedSalary.find(create(:salary, base_amount: 1000).id) }

    it "records the event returned by the model's event method" do
      record.update!(base_amount: 1500)

      expect(AuditLog.last).to have_attributes(
        event_type: "amount_changed",
        snapshot: { "base_amount" => "1000.0" }
      )
    end
  end
end
