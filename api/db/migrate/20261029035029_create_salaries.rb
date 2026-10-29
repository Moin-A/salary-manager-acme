class CreateSalaries < ActiveRecord::Migration[8.1]
  def change
    create_table :salaries do |t|
      t.integer :employee_id
      t.decimal :base_amount, precision: 12, scale: 2
      t.string :currency
      t.date :effective_date

      t.timestamps
    end
    add_index :salaries, :employee_id, unique: true
    add_foreign_key :salaries, :employees
  end
end
