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
    end

    def event_attribute_option(option_name)
      [ @model_class.audit_trail_options[option_name] ].flatten.compact.map(&:to_s)
    end
  end
end
