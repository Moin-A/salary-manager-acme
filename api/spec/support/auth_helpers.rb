module AuthHelpers
  def sign_in(user)
    cookies.encrypted[:user_id] = user.id
  end
end

RSpec.configure do |config|
  config.include AuthHelpers, type: :controller
end
