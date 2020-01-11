Rails.application.routes.draw do
  devise_for :users, controllers: { registrations: "registrations" }
  root to: 'home#index'
  
  devise_scope :user do
     get 'login', to: 'devise/sessions#new'
     get 'register', to: 'devise/registrations#new'
     delete 'logout', to: 'devise/sessions#destroy'
  end
  
  post 'online', to: 'home#online'
  post 'offline', to: 'home#offline'
end
