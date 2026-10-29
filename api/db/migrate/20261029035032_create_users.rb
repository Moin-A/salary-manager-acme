class CreateUsers < ActiveRecord::Migration[8.1]
  def change
    create_table :users do |t|
      t.string :login
      t.string :password_digest
      t.string :role

      t.timestamps
    end
    add_index :users, :login, unique: true
  end
end
