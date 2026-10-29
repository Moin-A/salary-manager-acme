class ApplicationController < ActionController::API
  include ActionController::HttpAuthentication::Token::ControllerMethods

  before_action :authenticate

  private

  attr_reader :current_user

  def authenticate
    @current_user = authenticate_with_http_token do |token, _options|
      User.find_signed(token, purpose: :session)
    end

    render json: { error: "Not logged in" }, status: :unauthorized unless current_user
  end
end
