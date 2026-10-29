class CreateAuditLogs < ActiveRecord::Migration[8.1]
  def change
    create_table :audit_logs do |t|
      t.integer :user_id
      t.string :event_type
      t.string :entity_type
      t.integer :entity_id
      t.jsonb :snapshot
      t.text :note

      t.datetime :created_at, null: false
    end
    add_index :audit_logs, :user_id
    add_index :audit_logs, [ :entity_type, :entity_id, :created_at ]
    add_foreign_key :audit_logs, :users
  end
end
