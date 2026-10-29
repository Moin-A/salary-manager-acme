class AddLockVersionToSalaries < ActiveRecord::Migration[8.1]
  def change
    add_column :salaries, :lock_version, :integer, default: 0, null: false
  end
end
