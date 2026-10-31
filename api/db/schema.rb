# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_10_31_023911) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "audit_logs", force: :cascade do |t|
    t.integer "user_id"
    t.string "event_type"
    t.string "entity_type"
    t.integer "entity_id"
    t.jsonb "snapshot"
    t.text "note"
    t.datetime "created_at", null: false
    t.index ["entity_type", "entity_id", "created_at"], name: "index_audit_logs_on_entity_type_and_entity_id_and_created_at"
    t.index ["user_id"], name: "index_audit_logs_on_user_id"
  end

  create_table "countries", force: :cascade do |t|
    t.string "name"
    t.string "currency_code"
    t.string "time_zone"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "employees", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.integer "country_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["country_id"], name: "index_employees_on_country_id"
  end

  create_table "exchange_rates", force: :cascade do |t|
    t.string "currency_code"
    t.decimal "rate_to_usd", precision: 14, scale: 6
    t.date "rate_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["currency_code", "rate_date"], name: "index_exchange_rates_on_currency_code_and_rate_date", unique: true
  end

  create_table "salaries", force: :cascade do |t|
    t.integer "employee_id"
    t.decimal "base_amount", precision: 12, scale: 2
    t.string "currency"
    t.date "effective_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "lock_version", default: 0, null: false
    t.index ["employee_id"], name: "index_salaries_on_employee_id", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "login"
    t.string "password_digest"
    t.string "role"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["login"], name: "index_users_on_login", unique: true
  end

  add_foreign_key "audit_logs", "users"
  add_foreign_key "employees", "countries"
  add_foreign_key "salaries", "employees"
end
