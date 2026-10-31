class User < ApplicationRecord
  has_secure_password

  def admin?
    role == "admin"
  end
end
