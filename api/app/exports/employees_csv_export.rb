# Employees with their current salary; the salary cells are empty when they have none.
class EmployeesCsvExport < CsvExport
  define_column("Employee ID", &:id)
  define_column("First Name", &:first_name)
  define_column("Last Name", &:last_name)
  define_column("Country") { |employee| employee.country.name }
  define_column("Base Amount") { |employee| employee.salary&.base_amount&.to_s("F") }
  define_column("Currency") { |employee| employee.salary&.currency }
  define_column("Effective Date") { |employee| employee.salary&.effective_date }
end
