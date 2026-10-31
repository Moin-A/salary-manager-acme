require "csv"

# Base class for CSV downloads. A subclass lists its columns, each a header
# plus a block that reads the cell's value from one record:
#
#   class EmployeesCsvExport < CsvExport
#     define_column("First Name", &:first_name)
#     define_column("Country") { |employee| employee.country.name }
#   end
#
#   EmployeesCsvExport.new(Employee.all).to_csv
class CsvExport
  Column = Data.define(:header, :value)

  # Characters that make a spreadsheet treat a cell as a formula (CSV injection).
  FORMULA_PREFIXES = %w[= + - @].freeze

  class << self
    # The columns, in the order the subclass defined them.
    def columns
      @columns ||= []
    end

    def define_column(header, &value)
      columns << Column.new(header: header, value: value)
    end
  end

  def initialize(records)
    @records = records
  end

  def to_csv
    CSV.generate do |csv|
      csv << self.class.columns.map(&:header)
      @records.each { |record| csv << row(record) }
    end
  end

  private

  def row(record)
    self.class.columns.map { |column| safe_cell(column.value.call(record)) }
  end

  # Prefixes formula-like text with ' so a spreadsheet shows it rather than runs it.
  def safe_cell(value)
    return value unless value.is_a?(String) && value.start_with?(*FORMULA_PREFIXES)

    "'#{value}"
  end
end
