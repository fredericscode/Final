import consumer from "./consumer"

const roomSubscriber = consumer.subscriptions.create("RoomChannel", {
  connected() {
    // Called when the subscription is ready for use on the server
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
      
    if (data['step'] === 'receiving the call'){

       var sender_first_name = data['sender_first_name'];
       var sender_id = data['sender_id'];
       var session_id = data['session_id'];
       var session_id_modal = document.getElementById('session_id');
       session_id_modal.innerHTML = session_id;
       var sender_id_modal = document.getElementById('sender_id');
       sender_id_modal.innerHTML = sender_id;
       var sender_name_modal = document.getElementById('sender_name');
       sender_name_modal.innerHTML = sender_first_name;
     
       // Display the receiver notification modal
       $('#receiver-notif-modal').modal('show');

    }
    
    // ============ BROADCASTING THE SESSION TO THE RECIPIENT.=====================================================
    if (data['step'] === 'Broadcasting session to the recipient') {
      console.log('Broadcasting the session to the recipient');
      // Initialize the session
      const session = OT.initSession(data['apikey'], data['session_id']);

      // Initialize the publisher for the recipient
      var publisherProperties = {insertMode: "append", width: '100%', height: '100%'};
      const publisher = OT.initPublisher('publisher', publisherProperties, function (error) {
        if (error) {
          console.log(`Couldn't initialize the publisher: ${error}`);
        } else {
          console.log("Receiver publisher initialized.");
        }
      });
      $('#session-modal').modal("show");

      // Detect when new streams are created and subscribe to them.
      session.on("streamCreated", function (event) {
        console.log("New stream in the session");
        var subscriberProperties = {insertMode: 'append', width: '100%', height: '100%'};
        const subscriber = session.subscribe(event.stream, 'subscriber', subscriberProperties, function(error) {
          if (error) {
            console.log(`Couldn't subscribe to the stream: ${error}`);
          } else {
            console.log("Receiver subscribed to the sender's stream");
          }
        });
      });

      //When a stream you publish leaves a session, the Publisher object dispatches a streamDestroyed event:
      publisher.on("streamDestroyed", function (event) {
        console.log("The publisher stopped streaming. Reason: "
        + event.reason);

      });

      //When a stream, other than your own, leaves a session, the Session object dispatches a streamDestroyed event:
      session.on("streamDestroyed", function (event) {
        console.log("Stream stopped. Reason: " + event.reason);
      });


      session.on({
        connectionCreated: function (event) {
          if (event.connection.connectionId != session.connection.connectionId) {
            connectionCount++;
            console.log(`Another client connected. ${connectionCount} total.`);
          }
        },
        connectionDestroyed: function connectionDestroyedHandler(event) { // When David hangs up, we end Alex's connection to the session and we hide his session window.
          connectionCount--;
          console.log(`A client disconnected. ${connectionCount} total.`);
          session.disconnect();
          $('#session-modal').modal('hide');


        }
      });

      session.on("sessionDisconnected", function(event) {
        console.log("The session disconnected. " + event.reason);
      });

      // Connect to the session
      // If the connection is successful, publish an audio-video stream.
      session.connect(data['token'], function(error) {
        if (error) {
          console.log("Error connecting to the session:", error.name, error.message);
        } else {
          console.log("Connected to the session.");
          session.publish(publisher, function(error) {
            if (error) {
              console.log(`couldn't publish to the session: ${error}`);
            } else {
              console.log("The receiver is publishing a stream");
            }
          });
        }
      });
      
      // Whenever Alex clicks on the stopSessionBtn(the red camera icon on the session modal), we end his connection to the session and we hide his session modal.
      const stopSessionBtn = document.getElementById("stop-session");
      stopSessionBtn.addEventListener('click', (event)=> {
        event.preventDefault();
        console.log("stop-session btn clicked");
        session.disconnect();
        $('#session-modal').modal('hide');

      });


    }

// ============ BROADCASTING THE SESSION TO THE SENDER.=====================================================
    if (data['step'] === 'Broadcasting session to the sender') {
      console.log('Broadcasting the session to the sender');

      // Initialize the session
      const session = OT.initSession(data['apikey'], data['session_id']);
      console.log(session);
      
      // Hide the modal
      $('#sender-notif-modal').modal("hide");
      
      // Initialize the publisher for the sender
      var publisherProperties = {insertMode: "append", width: '100%', height: '100%'};
      const publisher = OT.initPublisher('publisher', publisherProperties, function (error) {
        if (error) {
          console.log(`Couldn't initialize the publisher: ${error}`);
        } else {
          console.log("Sender publisher initialized.");
        }
      });
      $('#session-modal').modal("show");
      // Detect when new streams are created and subscribe to them.
      session.on("streamCreated", function (event) {
        console.log("New stream in the session");
        var subscriberProperties = {insertMode: 'append', width: '100%', height: '100%'};
        const subscriber = session.subscribe(event.stream, 'subscriber', subscriberProperties, function(error) {
          if (error) {
            console.log(`Couldn't subscribe to the stream: ${error}`);
          } else {
            console.log("Sender subscribed to the receiver's stream");
          }
        });
      });

      //When a stream you publish leaves a session the Publisher object dispatches a streamDestroyed event:
      publisher.on("streamDestroyed", function (event) {
        console.log("The publisher stopped streaming. Reason: "
        + event.reason);
      });

      //When a stream, other than your own, leaves the Session
      session.on("streamDestroyed", function (event) {
        console.log("Stream stopped. Reason: " + event.reason);
      });

      session.on({
        connectionCreated: function (event) {
          if (event.connection.connectionId != session.connection.connectionId) {
            connectionCount++;
            console.log(`Another client connected. ${connectionCount} total.`);
          }
        },
        connectionDestroyed: function connectionDestroyedHandler(event) { // When Alex hangs up, we end David's connection to the session and we hide his session window.
          connectionCount--;
          console.log(`A client disconnected. ${connectionCount} total.`);
          session.disconnect();
          $('#session-modal').modal('hide');
        }
      });

      session.on("sessionDisconnected", function(event) {
        console.log("The session disconnected. " + event.reason);
      });

      // Connect to the session
      // If the connection is successful, publish an audio-video stream.
      session.connect(data['token'], function(error) {
        if (error) {
          console.log("Error connecting to the session:", error.name, error.message);
        } else {
          console.log("Connected to the session.");
          session.publish(publisher, function(error) {
            if (error) {
              console.log(`couldn't publish to the session: ${error}`);
            } else {
              console.log("The sender is publishing a stream");
            }
          });
        }
      });
	
      // Whenever David clicks on the stopSessionBtn(the red camera icon on the session modal), we end his connection to the session and we hide his session modal.
      const stopSessionBtn = document.getElementById("stop-session");
      stopSessionBtn.addEventListener('click', (event)=> {
        event.preventDefault();
        console.log("stop-ssesion btn clicked");
        session.disconnect();
        $('#session-modal').modal('hide');



      });

    }
    
    
    
  },
  
  call(recipient_id) {
    return this.perform('call', {
      recipient_id: recipient_id
    });
  },
  
  answer(session_id, sender_id) {
    console.log(`Hello from the answer method: ${session_id}`);
    return this.perform('answer', {
        session_id: session_id,
        sender_id: sender_id
    });
  }
  
});

export default roomSubscriber

