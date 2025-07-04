const ID_SIZE = 36;
const PEER_ID = getID("peer_id");
let ROOM_ID = getID("room_id");

let stream;
let videoTracks;
let audioTracks;
let currentCamera = 'user'; // default camera
const toggleVideoBtn = document.getElementById('toggle-video');
const toggleAudioBtn = document.getElementById('toggle-mic');
const switchCameraBtn = document.getElementById('toggle-camera');
const videosdiv = document.querySelector(".videos");
let currentCall = []; // Holds the current calls
let ROOM_MEMBERS = []; // A list of all peers connected to the room!

var peer = new Peer(PEER_ID);
var ROOM = null;


// Sending video stream to video element
var localVideo = document.querySelector("#localVideo");


// Add SW.js
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/assets/js/sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
  


// Function to all all peers in my currentCall
function answerCurrentCall(stream) {
    try {
        currentCall.forEach((v, k) => {
            v.answer(stream);
        })
        return true;
    } catch (error) {
        console.error(error, "--error while answering call")
        return false;
    }
}

// Remove Call if exists
function removeCall(call) {
    currentCall = [...currentCall.filter((v) => v.peer != call.peer)];
    try {
        document.querySelector(`video#${call.peer}`).remove();
    } catch (error) {

    }

}

// Function to get user media and start stream
async function getUserMedia(constraints) {
    try {
        const newStream = await navigator.mediaDevices.getUserMedia(constraints);
        localVideo.srcObject = newStream;
        console.log(newStream);

        // Store the tracks for toggling
        videoTracks = newStream.getVideoTracks();
        audioTracks = newStream.getAudioTracks();
        stream = newStream;

        answerCurrentCall(stream); // Answer incoming call with stream

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

async function switchCamera() {
    if (isDesktop()) {
        if (currentCamera === 'screen') {
            currentCamera = 'environment'; // Switch back to camera
            await initializeStream();
        } else {
            currentCamera = 'screen'; // Switch to screen recording
            if (stream) {
                stream.getTracks().forEach(track => track.stop()); // Stop existing stream
            }
            try {
                const newStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                localVideo.srcObject = newStream;
                videoTracks = newStream.getVideoTracks();
                stream = newStream;
                if (currentCall) {
                    currentCall.answer(stream); // Answer incoming call with stream
                }
            } catch (error) {
                console.error("Error accessing display media.", error);
            }
        }
    } else {
        currentCamera = (currentCamera === 'environment') ? 'user' : 'environment'; // Toggle camera type
        if (stream) {
            stream.getTracks().forEach(track => track.stop()); // Stop existing stream
        }
        await initializeStream(); // Initialize with the new camera
    }
}


function isDesktop() {
    return !/Mobi|Android/i.test(navigator.userAgent);
}

// To answer an incoming call
function receiveCalls() {
    peer.on('call', (incomingCall) => {
        removeCall(incomingCall);// Remove it if it already exists!
        currentCall.push(incomingCall);
        // Answer the incoming calls with our media stream
        answerCurrentCall(stream);
        console.log(incomingCall);
        incomingCall.on('stream', (remoteStream) => {
            genVideoEl(remoteStream, incomingCall.peer)
            console.log('Remote stream received while answering');
        });
    });
}


// To make an outgoing call
function callPeer(peerId) {
    console.log(peerId, "--stream is here, and we sendin git")
    const call = peer.call(peerId, stream); // Call another peer with our media stream
    removeCall(call);// Remove it if it already exists!
    currentCall.push(call);
    // Answer the incoming calls with our media stream
    //answerCurrentCall(stream);
    console.log(call);
    call.on('stream', (remoteStream) => {
        genVideoEl(remoteStream, call.peer)
        console.log('Remote stream received');
    });
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

peer.on('open', function (id) {
    var urlParams = new URLSearchParams(window.location.search);
    let room_id = urlParams.get('id');
    if (room_id) {
        ROOM_ID = room_id;
        initializeStream().then(() => {
            let conn = peer.connect(room_id);// Connect to the room
            conn.on("open", () => {
                console.log("CONNECTED SUCCESSFULLY TO THE REMOTE ROOM");
                conn.on("data", (data) => {// Received any data from the room
                    if (data.type == "peerlist") {// If its the list of people in the room
                        console.log(data, "--peers already connected")
                        data.content.forEach((v, k) => {
                            console.log("calling this guy", v)
                            callPeer(v);
                        });
                    }
                })
            })
            receiveCalls();
        })

    } else {
        initializeStream().then(() => {
            buildRoom();
        })
    }
    /*if (remote_peer_id) {
        callPeer(remote_peer_id);
    }else{
        
    }*/
});

peer.on('connection', function (conn) {
    conn.on('data', function (data) {
        // Will print 'hi!'
        console.log(data, "--connected--");
    });
});

peer.on('error', function (err) { console.error(err, "peer-error") });



function buildRoom() {
    ROOM = new Peer(ROOM_ID);

    ROOM.on("connection", (conn) => {
        console.log("CONNECTED TO THE BUILT ROOM----", conn.peer);
        ROOM_MEMBERS = [...ROOM_MEMBERS.filter((v) => v != conn.peer), conn.peer]; // Making sure i remove it from the list before adding it
        // Send PEER LIST
        conn.on("open", () => {
            conn.send({
                type: "peerlist",
                content: ROOM_MEMBERS.filter((v) => v != conn.peer)
            });
        })

    });

    ROOM.on("error", (e) => {
        console.error(e, "--ROOM ERROR")
    })

    ROOM.on("open", () => {
        peer.connect(ROOM_ID);
    });
    // I see no need to accept data from the room about peer list, since i know i am the only candidate on init
    receiveCalls();
}



function generateUniqueRandomID(id_length) {
    var id = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < id_length; i++) {
        id += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return id;
}

function getID(name) {
    if (localStorage.getItem(name)) {
        return localStorage.getItem(name);
    } else {
        let new_id = generateUniqueRandomID(ID_SIZE);
        localStorage.setItem(name, new_id);
        return new_id;
    }
}

function genVideoEl(thestream, theid) {
    console.log(theid, "--this video is created!");
    let new_remote;
    if (document.querySelector(`video#${theid}`)) {
        new_remote = document.querySelector(`video#${theid}`);
    }else{
        new_remote = document.createElement("video");
        new_remote.autoplay = true;
        //new_remote.muted = true;
        new_remote.id = theid;
        videosdiv.appendChild(new_remote);
    }
    new_remote.srcObject = thestream;
}

// Event listeners for UI buttons
toggleVideoBtn.addEventListener('click', toggleVideo);
toggleAudioBtn.addEventListener('click', toggleAudio);
switchCameraBtn.addEventListener('click', switchCamera);

document.querySelector("#toggle-share").onclick = function (e) {
    navigator.share({url : window.location.origin + window.location.pathname + "?id=" + ROOM_ID});
    navigator.clipboard.writeText(window.location.origin + window.location.pathname + "?id=" + ROOM_ID).then(function () {
        console.log("Copied to clipboard");
    }, function () {
        console.log("Failed to copy to clipboard");
    });
}