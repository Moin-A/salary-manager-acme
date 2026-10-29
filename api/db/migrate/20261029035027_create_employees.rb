class CreateEmployees < ActiveRecord::Migration[8.1]
  def change
    create_table :employees do |t|
      t.string :first_name
      t.string :last_name
      t.integer :country_id

      t.timestamps
    end
    add_index :employees, :country_id
    add_foreign_key :employees, :countries
  end
end
