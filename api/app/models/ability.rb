# Who can do what. One role for now: an admin can do everything; anyone
# else can do nothing beyond seeing their own session.
class Ability
  include CanCan::Ability

  def initialize(user)
    can :manage, :all if user&.admin?
  end
end
