class ReportsController < ApplicationController
  def salaries_by_country
    month = Date.strptime(report_params.require(:month), "%Y-%m")

    report = SalaryReport.new(month)

    render json: {
      month: month.strftime("%Y-%m"),
      currency: "USD",
      countries: report.by_country,
      exchange_rates: report.exchange_rates
    }
  rescue Date::Error
    render json: { error: "month must be in YYYY-MM format" }, status: :bad_request
  end

  private

  def report_params
    params.permit(:month)
  end
end
