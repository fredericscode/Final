import consumer from "./consumer"

consumer.subscriptions.create("AppearanceChannel", {
  connected() {
    // Called when the subscription is ready for use on the server
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    // Called when there's incoming data on the websocket for this channel
    //=================== IF THE USER IS ONLINE ============================//////////////
    if (data['state'] === "online") {
        var dot = document.getElementById("js-appearance" + data['user_id']);
        var camera_icon = document.getElementById("js-camera-icon" + data['user_id']);
        if (dot !== null && camera_icon !== null) { // This values are null for the current_user
            dot.classList.remove("offline");
            dot.classList.add("online");
            camera_icon.classList.remove("offline");
            camera_icon.classList.add("online");
        }
  
  
   //===================== IF THE USER IS OFFLINE =========================///////////////
    } else if (data['state'] === "offline" ) { // e.g: the user logged out
        var offDot = document.getElementById("js-appearance" + data['user_id']);
        var offCameraIcon = document.getElementById("js-camera-icon" + data['user_id']);
        if (offDot !== null && offCameraIcon !== null) {
            offDot.classList.remove("online");
            offDot.classList.add("offline");
            offCameraIcon.classList.remove("online");
            offCameraIcon.classList.add("offline");
        
        }
  
    }
    
  }
});
