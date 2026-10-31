# Seeds an admin user, countries, exchange rates and 10,000 employees with one
# current salary each. Safe to run again: the admin, countries and rates are
# only created when missing, and employees are only seeded into an empty table.
#
#   bin/rails db:seed
#
# The admin logs in as admin / admin123 unless ADMIN_LOGIN and ADMIN_PASSWORD
# are set; set them in any deployed environment.

EMPLOYEE_COUNT = 10_000

# rate_to_usd values are fixed approximations until the twice-daily refresh exists.
COUNTRIES = [
  { name: "United States",  currency_code: "USD", time_zone: "America/New_York", rate_to_usd: 1.0,    salary_range: 50_000..180_000 },
  { name: "United Kingdom", currency_code: "GBP", time_zone: "Europe/London",    rate_to_usd: 1.27,   salary_range: 35_000..120_000 },
  { name: "India",          currency_code: "INR", time_zone: "Asia/Kolkata",     rate_to_usd: 0.012,  salary_range: 600_000..4_000_000 },
  { name: "Germany",        currency_code: "EUR", time_zone: "Europe/Berlin",    rate_to_usd: 1.08,   salary_range: 45_000..130_000 },
  { name: "Japan",          currency_code: "JPY", time_zone: "Asia/Tokyo",       rate_to_usd: 0.0067, salary_range: 4_000_000..15_000_000 },
  { name: "Canada",         currency_code: "CAD", time_zone: "America/Toronto",  rate_to_usd: 0.73,   salary_range: 55_000..160_000 },
  { name: "Australia",      currency_code: "AUD", time_zone: "Australia/Sydney", rate_to_usd: 0.66,   salary_range: 60_000..170_000 },
  { name: "Singapore",      currency_code: "SGD", time_zone: "Asia/Singapore",   rate_to_usd: 0.74,   salary_range: 50_000..200_000 }
].freeze

FIRST_NAMES = %w[
  Aarav Ada Akira Alice Amara Ana Arjun Ben Carlos Chen Chloe Daniel Diya Elena
  Emma Ethan Fatima Felix Grace Hana Hiro Isabella James Kai Lars Leah Liam Lucia
  Maya Mei Mohammed Noah Olivia Omar Priya Ravi Sakura Sara Sofia Tom Yuki Zara
].freeze

LAST_NAMES = %w[
  Anderson Bauer Brown Chen Clark Das Fischer Garcia Gupta Hoffmann Ito Jones
  Kapoor Khan Kim Kumar Lee Lopez Martin Meyer Miller Mori Nair Nguyen Patel
  Rossi Sato Schmidt Sharma Singh Smith Suzuki Tan Taylor Thomas Wang Wilson Wong
].freeze

User.find_or_create_by!(login: ENV.fetch("ADMIN_LOGIN", "admin")) do |user|
  user.password = ENV.fetch("ADMIN_PASSWORD", "admin123")
  user.role = "admin"
end

COUNTRIES.each do |attributes|
  Country.find_or_create_by!(name: attributes[:name]) do |country|
    country.currency_code = attributes[:currency_code]
    country.time_zone = attributes[:time_zone]
  end

  ExchangeRate.find_or_create_by!(currency_code: attributes[:currency_code], rate_date: Date.current) do |rate|
    rate.rate_to_usd = attributes[:rate_to_usd]
  end
end

if Employee.exists?
  puts "Employees already seeded, skipping."
else
  random = Random.new(42)
  countries = Country.where(name: COUNTRIES.pluck(:name)).index_by(&:name)

  # insert_all skips validations and callbacks: fast for 10,000 rows, and
  # seeding doesn't write audit history.
  employee_rows = Array.new(EMPLOYEE_COUNT) do
    {
      first_name: FIRST_NAMES.sample(random: random),
      last_name: LAST_NAMES.sample(random: random),
      country_id: countries.fetch(COUNTRIES.sample(random: random)[:name]).id
    }
  end
  employee_rows.each_slice(1_000) { |batch| Employee.insert_all!(batch) }

  country_by_id = COUNTRIES.index_by { |attributes| countries.fetch(attributes[:name]).id }

  salary_rows = Employee.pluck(:id, :country_id).map do |employee_id, country_id|
    country = country_by_id.fetch(country_id)
    {
      employee_id: employee_id,
      base_amount: random.rand(country[:salary_range]),
      currency: country[:currency_code],
      effective_date: Date.current - random.rand(0..730)
    }
  end
  salary_rows.each_slice(1_000) { |batch| Salary.insert_all!(batch) }

  puts "Seeded #{Employee.count} employees with #{Salary.count} salaries across #{countries.size} countries."
end
