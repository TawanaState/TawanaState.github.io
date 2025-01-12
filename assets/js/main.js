const ID_SIZE = 36;
const PEER_ID = generateUniqueRandomID(ID_SIZE);
var remote_peer_id;
const share_link = window.location.origin + window.location.pathname + "?id=" + PEER_ID;
//var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

let stream;
let videoTracks;
let audioTracks;
let currentCamera = 'environment'; // default camera
const toggleVideoBtn = document.getElementById('toggle-video');
const toggleAudioBtn = document.getElementById('toggle-mic');
const switchCameraBtn = document.getElementById('toggle-camera');
let currentCall = null; // Holds the current call object
var peer = new Peer(PEER_ID);

document.querySelector("#toggle-share").onchange = function(e) {
    navigator.clipboard.writeText(share_link).then(function() {
        console.log("Copied to clipboard");
    }, function() {
        console.log("Failed to copy to clipboard");
    });
}

// Sending video stream to video element
var localVideo = document.querySelector("#localVideo");
var remoteVideo = document.querySelector("#remoteVideo");


// Function to get user media and start stream
async function getUserMedia(constraints) {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      localVideo.srcObject = newStream;
      
      // Store the tracks for toggling
      videoTracks = newStream.getVideoTracks();
      audioTracks = newStream.getAudioTracks();
      stream = newStream;
      
      // If there's an ongoing call, add the stream to it
      if (currentCall) {
        currentCall.answer(stream); // Answer incoming call with stream
      }
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
}

// Initialize stream with the default camera
async function initializeStream() {
    await getUserMedia({ video: { facingMode: currentCamera }, audio: true });
}

  // Toggle video on/off
function toggleVideo() {
    videoTracks.forEach(track => {
      track.enabled = !track.enabled; // Toggle the enabled state
    });
}

// Toggle audio on/off
function toggleAudio() {
    audioTracks.forEach(track => {
      track.enabled = !track.enabled; // Toggle the enabled state
    });
}

// Switch between front-facing and environment cameras
async function switchCamera() {
    currentCamera = (currentCamera === 'environment') ? 'user' : 'environment'; // Toggle camera type
    if (stream) {
      stream.getTracks().forEach(track => track.stop()); // Stop existing stream
    }
    await initializeStream(); // Initialize with the new camera
}




// To answer an incoming call
function receiveCalls() {
    peer.on('call', (incomingCall) => {
        currentCall = incomingCall;
        // Answer the incoming call with our media stream
        incomingCall.answer(stream);
        incomingCall.on('stream', (remoteStream) => {
          // Handle the remote stream (if you want to display the remote video, for example)
          remoteVideo.srcObject = remoteStream;
          console.log('Remote stream received');
        });
    });
}


// To make an outgoing call
function callPeer(peerId) {
    if (stream) {
      const call = peer.call(peerId, stream); // Call another peer with our media stream
      call.on('stream', (remoteStream) => {
        // Handle the remote stream from the other peer
        remoteVideo.srcObject = remoteStream;
        console.log('Remote stream received');
      });
    }
}





/*
document.querySelector("#btn-join-call").onclick = (e) => {
    var remote_peer_id = document.querySelector("#remote-peer-id").value;
    if (remote_peer_id.length == 0) {
        alert("Please enter a Call ID");
        return;
    }
    
    getUserMedia({video: true, audio: true}, function(stream) {
        var call = peer.call(remote_peer_id, stream);
        localVideo.srcObject = stream;
        call.on('stream', function(remoteStream) {
            // Show stream in some video/canvas element.
            
        });
    }, function(err) {
        console.log('Failed to get local stream' ,err);
    });
}


document.querySelector("#btn-start-call").onclick = (e) => {
    peer.on('call', function(call) {
        getUserMedia({video: true, audio: true}, function(stream) {
            call.answer(stream); // Answer the call with an A/V stream.
            localVideo.srcObject = stream
            call.on('stream', function(remoteStream) {
                // Show stream in some video/canvas element.
                remoteVideo.srcObject = remoteStream;
            });
        }, function(err) {
            console.log('Failed to get local stream' ,err);
        });
    });
}
*/

peer.on('open', function(id) {
	var urlParams = new URLSearchParams(window.location.search);
    remote_peer_id = urlParams.get('id');
    if (remote_peer_id) {
        callPeer(remote_peer_id);
    }else{
        receiveCalls();
    }
});

peer.on('connection', function(conn) {
    conn.on('data', function(data){
      // Will print 'hi!'
      console.log(data, "--connected--");
    });
});


function generateUniqueRandomID(id_length) {
    var id = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < id_length; i++) {
        id += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return id;
}

// Event listeners for UI buttons
toggleVideoBtn.addEventListener('click', toggleVideo);
toggleAudioBtn.addEventListener('click', toggleAudio);
switchCameraBtn.addEventListener('click', switchCamera);

initializeStream(); // Initialize stream with the default camera