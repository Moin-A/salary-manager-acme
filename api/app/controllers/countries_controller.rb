class CountriesController < ApplicationController
  def index
    countries = Country.order(:name)
    render json: countries.as_json(only: [ :id, :name, :currency_code ])
  end
end
