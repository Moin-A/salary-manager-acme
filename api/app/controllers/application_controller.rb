class ApplicationController < ActionController::API
  include ActionController::HttpAuthentication::Token::ControllerMethods

  before_action :authenticate
  # Every action must authorize (CanCanCan), so forgetting to is an error rather than a hole.
  check_authorization

  rescue_from CanCan::AccessDenied do
    render json: { error: "You are not allowed to do that" }, status: :forbidden
  end

  rescue_from ActionController::ParameterMissing do |error|
    render json: { error: error.message }, status: :bad_request
  end

  rescue_from ActiveRecord::StaleObjectError do
    render json: { error: "This record was changed by someone else. Reload and try again." }, status: :conflict
  end

  # A unique index rejected the write, e.g. two creates racing past a uniqueness validation.
  rescue_from ActiveRecord::RecordNotUnique do
    render_already_exists
  end

  private

  def render_already_exists
    render json: { error: "This record already exists." }, status: :conflict
  end

  def current_user
    Current.user
  end

  def authenticate
    Current.user = authenticate_with_http_token do |token, _options|
      User.find_signed(token, purpose: :session)
    end

    render json: { error: "Not logged in" }, status: :unauthorized unless current_user
  end
end
