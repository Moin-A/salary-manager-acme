module Audit
  # Per-model audit configuration, set up once by has_audit_trail.
  class ModelConfig
    attr_reader :model_class

    def initialize(model_class)
      @model_class = model_class
    end

    def setup(options)
      @model_class.class_attribute :audit_trail_options, instance_writer: false
      @model_class.audit_trail_options = options.dup
      @model_class.audit_trail_options[:only] = event_attribute_option(:only)
      # A note for one specific save: set it on the record just before saving.
      @model_class.attr_accessor :audit_note
      on_update if Array(options[:on]).include?(:update)
    end

    def event_attribute_option(option_name)
      [ @model_class.audit_trail_options[option_name] ].flatten.compact.map(&:to_s)
    end

    # after_update runs inside the update's transaction, so if writing the
    # audit row fails, the record change is rolled back with it.
    def on_update
      @model_class.after_update do |record|
        snapshot = record.audit_trail_options[:only].index_with do |column|
          record.attribute_before_last_save(column)
        end

        event = record.audit_trail_options[:event]

        AuditLog.create!(
          entity_type: record.class.name,
          entity_id: record.id,
          event_type: event && record.public_send(event),
          user_id: Current.user&.id,
          note: record.audit_note,
          snapshot: snapshot
        )
      end
    end
  end
end
