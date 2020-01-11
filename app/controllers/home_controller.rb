class HomeController < ApplicationController
  def index
      @users = User.where.not(id: current_user.id) if user_signed_in?
  end
  
  def online
    current_user.online!
    broadcast_change_to_users("online")
    respond_to do |format|
        format.js
    end
  end

  def offline
    current_user.offline!
    broadcast_change_to_users("offline")
    respond_to do |format|
        format.js
    end
  end
  
  
  private 

  def broadcast_change_to_users(state)
    ActionCable.server.broadcast(
        "appearance",
        state: state,
        user_id: current_user.id
    )
  end
  
  
  
end
