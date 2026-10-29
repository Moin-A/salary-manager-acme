class CreateExchangeRates < ActiveRecord::Migration[8.1]
  def change
    create_table :exchange_rates do |t|
      t.string :currency_code
      t.decimal :rate_to_usd, precision: 14, scale: 6
      t.date :rate_date

      t.timestamps
    end
    add_index :exchange_rates, [ :currency_code, :rate_date ], unique: true
  end
end
