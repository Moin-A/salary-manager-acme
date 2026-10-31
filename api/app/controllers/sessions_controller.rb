class SessionsController < ApplicationController
  TOKEN_LIFETIME = 12.hours

  skip_before_action :authenticate, only: :create
  # Logging in, and seeing who you are, is open to every user.
  skip_authorization_check

  def create
    user = User.authenticate_by(login: session_params[:login], password: session_params[:password])

    if user
      token = user.signed_id(purpose: :session, expires_in: TOKEN_LIFETIME)
      render json: { token: token, user: user_json(user) }
    else
      render json: { error: "Invalid login or password" }, status: :unauthorized
    end
  end

  def show
    render json: user_json(current_user)
  end

  private

  def session_params
    params.permit(:login, :password)
  end

  def user_json(user)
    user.as_json(only: [ :id, :login, :role ])
  end
end
