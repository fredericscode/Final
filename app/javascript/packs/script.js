import roomSubscriber from '../channels/room_channel'

document.addEventListener('DOMContentLoaded', (event) => {

  /* Avatar upload functionality for user registration */
  var readURL = function(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('.profile-pic').attr('src', e.target.result);
            }
    
            reader.readAsDataURL(input.files[0]);
        }
  }
   
  $(".file-upload").on('change', function(){
      readURL(this);
  });
    
  $(".upload-button").on('click', function() {
      $(".file-upload").click();
  });
  
  /* Scroll to the developers section when the start button is clicked */
  const startBtn = document.getElementById('js-start-btn')
  const devSection = document.getElementById('js-developers')
  if (startBtn !== null) {
    startBtn.addEventListener('click', (event) => {
      event.preventDefault()
      devSection.scrollIntoView({behavior: 'smooth', block: 'start'})
    })
  }
  
  
  /* Change the background color and innerHTML when the online button is hovered */
  const onlineBtn = document.getElementById('js-onlinebtn')
  if( onlineBtn !== null) {
    
        onlineBtn.addEventListener('mouseover', (event) => {
            onlineBtn.style.backgroundColor = "red"
            onlineBtn.style.borderColor = "red"
            onlineBtn.innerHTML = "Go offline"
    
        })
    
        onlineBtn.addEventListener('mouseout', (event) => {
            onlineBtn.style.backgroundColor = "#3DC794"
            onlineBtn.style.borderColor = "#3DC794"
            onlineBtn.innerHTML = "You are online"
    
        })
  }
  
  
  var cameraIcons = document.getElementsByClassName('camera-icon');
    for (let item of cameraIcons) {
      item.addEventListener('click', (event) => {
        event.preventDefault();
        var recipient_id = item.getAttribute("data-id");
        var recipient_name = item.getAttribute("data-name");
        console.log(recipient_id);
        console.log(recipient_name);
        var recipient_name_modal = document.getElementById('recipient_name_modal');
        recipient_name_modal.innerHTML = recipient_name;
        $('#sender-notif-modal').modal('show');
        
        roomSubscriber.call(recipient_id);
      })
    }

    // Call the answer method when the answer_btn is clicked.
    const answerBtn = document.getElementById("answer-call");
    answerBtn.addEventListener('click', (event) => {
      event.preventDefault();
      var session_id = document.getElementById("session_id").innerHTML;
      var sender_id = document.getElementById('sender_id').innerHTML;
      console.log(session_id);
      console.log("answer btn clicked");
      $('#receiver-notif-modal').modal('hide');
      roomSubscriber.answer(session_id, sender_id);
    });

  
  
  
  
  
  
  
  
  
  
  
  
})