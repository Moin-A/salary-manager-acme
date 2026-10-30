Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  resource :session, only: [ :show, :create ]

  resources :countries, only: [ :index ]
  resources :audit_logs, only: [ :index ], path: "audit-logs"

  resources :employees, only: [ :index, :show, :create, :update ] do
    resources :salaries, only: [ :index, :create, :update ]
  end

  # Defines the root path route ("/")
  # root "posts#index"
end
