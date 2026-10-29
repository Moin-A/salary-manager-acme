module AuthHelpers
  def sign_in(user)
    request.headers["Authorization"] = "Bearer #{user.signed_id(purpose: :session)}"
  end

  def sign_out
    request.env.delete("HTTP_AUTHORIZATION")
  end
end

RSpec.configure do |config|
  config.include AuthHelpers, type: :controller
  config.include ActiveSupport::Testing::TimeHelpers
end
