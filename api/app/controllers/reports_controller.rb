class ReportsController < ApplicationController
  def salaries_by_country
    month = Date.strptime(report_params.require(:month), "%Y-%m")

    render json: {
      month: month.strftime("%Y-%m"),
      currency: "USD",
      countries: SalaryReport.new(month).by_country
    }
  rescue Date::Error
    render json: { error: "month must be in YYYY-MM format" }, status: :bad_request
  end

  private

  def report_params
    params.permit(:month)
  end
end
