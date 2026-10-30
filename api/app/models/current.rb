# Per-request state. Rails resets it after every request, so a value set
# for one user can never leak into the next request.
class Current < ActiveSupport::CurrentAttributes
  attribute :user
end
