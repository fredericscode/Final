class SessionsController < Devise::SessionsController
  
  def destroy
       
       if current_user.online?
         current_user.offline!
         broadcast_change_to_users("offline")
       end

       super
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