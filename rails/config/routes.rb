Backend::Application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'
  namespace :api do
    resources :posts
    resources :analytics, only: [:index]
    resources :timeline
    resources :contacts
  end

  devise_for :users, controllers: { sessions: 'sessions' }

  root 'static#index'
  resources :templates, only: [:show]
  get '*path' => 'static#index'

end
