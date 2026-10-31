# Admin is the only role for now, so the existing HR users become admins.
class MakeExistingUsersAdmins < ActiveRecord::Migration[8.1]
  def up
    execute "UPDATE users SET role = 'admin' WHERE role = 'hr'"
  end

  def down
    execute "UPDATE users SET role = 'hr' WHERE role = 'admin'"
  end
end
