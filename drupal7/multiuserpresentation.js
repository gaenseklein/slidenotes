var ws = {server:null};

ws.joinSession = function(){
    this.init();
    //deactivate controls:
    document.body.classList.add("spectator");
    window.onkeyup = function(e){};
    this.creator = false;
}

ws.createSession = function(){
    this.init();
    this.creator = true;
}

ws.init = async function(){
    if(this.server===null){
        this.server = await new WebSocket("ws://localhost:3000");
     }
    this.server.onopen = function(){ws.init2();};
}

ws.init2 = async function(){
        this.room = await hash(location.pathname+slidenoteguardian.password);
        if(this.creator)this.sendMessage(this.room,"createRoom");
        else this.sendMessage(this.room,"joinRoom");
        this.server.onmessage = function incoming(msg){
            let data;
            try{
                data = JSON.parse(msg.data);
            }catch(e){
                console.log(e, msg);
                return;
            };
            if(data.action==="syncToSlideNr"){
                slidenoteplayer.gotoPage(data.msg,true);
            } 
            if(data.action==="init"){
                ws.id = data.id; 
                //peerworker.id = data.id;
            }
            if(data.action==="initCreator"){
                console.log("websocket-session created");
            }
            if(data.action==="userlist"){
                //gets a list with user-ids, including own:
                //for now we only use the length - minus self to show spectators length:
                this.userlist=data.msg;
            }
            /*
            if(data.action==="getUserNames"){
                peerworker.updatePeerConnectionList(data.data);
            }
            if(data.action==="webrtc")peerworker.recieveMessage(data.data);
            */
        }; //end of onmessage
        if(this.userName != undefined && this.userName != null)this.sendMessage(this.userName, "setUserName");
    
}

ws.sendMessage = function(msg, action, options){
        let data = {msg:msg, room:this.room, action:action, options:options};
        this.server.send(JSON.stringify(data));
}

ws.sendSlideNr = function(){
        if(this.creator===false)return;
        this.sendMessage(slidenoteplayer.actpage, "syncToSlideNr"); 
}

//helper functions:
hash = async function(text){
  let textutf8 = new TextEncoder().encode(text);
  let hash = new Uint8Array(await this.crypto.subtle.digest('SHA-256', textutf8));
  let result = "";
  for(let i=0;i<hash.length;i++)result+=String.fromCharCode(hash[i]+255);
  return result;
}

copylink = function(link, source){
                var text = link;
                var input = document.createElement('input');
                input.setAttribute('value', text);
                document.body.appendChild(input);
                input.select();
                var result = document.execCommand('copy');
                document.body.removeChild(input)
                console.log("copied "+text+" to clipboard:"+result);
                if(source===null||source===undefined)return;
                var oldlinkcopied = document.getElementById("linkcopyalert");
                if(oldlinkcopied)oldlinkcopied.parentElement.removeChild(oldlinkcopied);
                var linkcopied = document.createElement("div");
                var linktext = document.createElement("span");
                linktext.innerText = "link copied";
                var svgcheck = document.getElementById("cloud-ok");
                linkcopied.innerHTML = svgcheck.innerHTML;
                linkcopied.appendChild(linktext);
                linkcopied.id = "linkcopyalert";
                source.appendChild(linkcopied);
                setTimeout(function(){
                  var oldlinkcopied = document.getElementById("linkcopyalert");
                  if(oldlinkcopied)oldlinkcopied.parentElement.removeChild(oldlinkcopied);
                }, 6000);
}


//showDialog shows the ws-dialog on click on ws-menu-item
ws.showDialog = function(){
    let content = document.createElement("div");
    content.id="placeholder";
    let invitebutton = document.createElement("button");
    invitebutton.id="invitelink";
    invitebutton.onclick = function(){copylink(this.innerHTML,this);};
    let ivlink = location.href;
    if(ivlink.indexOf("#")>-1)ivlink = ivlink.substring(0,ivlink.indexOf("#"));
    ivlink+="#join";
    invitebutton.innerHTML = ivlink;
    content.appendChild(invitebutton);
    content.appendChild( document.createElement("hr"));
    let spectators = document.createElement("div");
    spectators.id="spectatorcountwrapper";
    let speccount = 0;
    if(this.userlist)speccount=this.userlist.length-1; //dont count yourself
    if(speccount<0)speccount=0; //could happen if userlist is not ready yet
    spectators.innerHTML = 'Spectators: <span id="spectatorcount">'+speccount+'</span>';
    content.appendChild(spectators);
    let dialogoptions ={
        title:"Multiuser-Presentation",
        type:"dialog",
        content:content,
        closebutton:true,
        focuson:invitebutton        
    }
    dialoger.buildDialog(dialogoptions); 
}

/*
for future use: the peerworker, establishes and controls audio and video per webrtc

*/
var peerworker = {
    peerconnections:{},
    iceservers: null,
    id:null    
};

peerworker.init = function(){
    //build video-html
    this.slidenoteVideo = document.createElement("video");
    this.slidenoteVideo.id = "slidenoteVideo";
    this.slidenoteVideo.autoplay = true;
    this.guestVideos = document.createElement("div");
    this.guestVideos.id = "guestVideos";

}

peerworker.recieveMessage = function(msg){
    switch(msg.type){
        // Signaling messages: these messages are used to trade WebRTC
       // signaling information during negotiations leading up to a video
      // call.

      case "video-offer":  // Invitation and offer to chat
        handleVideoOfferMsg(msg);
        break;

      case "video-answer":  // Callee has answered our offer
        handleVideoAnswerMsg(msg);
        break;

      case "new-ice-candidate": // A new ICE candidate has been received
        handleNewICECandidateMsg(msg);
        break;

      case "hang-up": // The other peer has hung up the call
        handleHangUpMsg(msg);
        break;

      // Unknown message; output to console for debugging.

      default:
        log_error("Unknown message received:");
        log_error(msg);
    }
}

peerworker.updatePeerConnectionList = function(usernames){
    for(var x=0;x<usernames.length;x++){
        let actid = this.peerconnections[usernames[x].id];
        if(peerconnections[actid]===undefined && actid != this.id){
            peerconnections[actid] = this.createPeerConnection(actid);
        }
    }

}
// direct functions to handle events: 
//start negotiation:
function handleNegotiationNeededEvent() {
  var PeerConnection = this;
  PeerConnection.createOffer().then(function(offer) {
    return PeerConnection.setLocalDescription(offer);
  })
  .then(function() {
    ws.sendMessage(msg:{
      name: ws.username,
      senderId:ws.id,
      target: PeerConnection.targetUUID,
      type: "video-offer",
      sdp: PeerConnection.localDescription
    },"webrtc");
  })
  .catch(reportError);
}

//recieve video-offer:
function handleVideoOfferMsg(msg){
    var targetUsername = msg.name;
    var targetId = msg.senderId;
    var peerconnection = peerworker.peerconnections[targetId];
    if(peerconnection===undefined)peerconnection = peerworker.createPeerConnection(targetid);
    var desc = new RTCSessionDescription(msg.sdp);
    peerconnection.setRemoteDescription(desc).then(function(){
        return navigator.mediaDevices.getUserMedia({audio:false,video:true});
    }).then(function(stream){
        //handle stream localy, e.g. mirror back to sending user
        peerworker.localStream = stream;
        //peerworker.localStreamVideoTag.srcObject = peerworker.localStream;
        //add stream as track to webrtc-object:
        peerworker.localStream.getTracks().forEach(track => peerconnection.addTrack(track, localStream));
    }).then(function(){
        return peerconnection.createAnswer();
    }).then(function(answer){
        return peerconnection.setLocalDescription(answer);
    }).then(function(){
        var msg = {
            name:ws.username,
            senderId:ws.id,
            target:peerconnection.targetUUID,
            type:"video-answer",
            sdp: peerconnection.localDescription
        };
        ws.sendMessage(msg,"webrtc");
    }).catch(handleGetUserMediaError);
}

//recieve video-answer:
async function handleVideoAnswerMsg(msg) {
  log("*** Call recipient has accepted our call");

  // Configure the remote description, which is the SDP payload
  // in our "video-answer" message.

  var desc = new RTCSessionDescription(msg.sdp);
  await peerworker.peerconnections[msg.senderId].setRemoteDescription(desc).catch(reportError);
}

//exchanging ice-candidates:
//send own ice-candidate:
function handleICECandidateEvent(event){
    if(event.candidate){
        let msg = {
            type:"new-ice-candidate",
            target:this.targetUUID,
            candidate:event.candidate
        };
        ws.sendMessage(msg,"webrtc");
    }
}
//recieve ice-candidate:
function handleNewICECandidateMsg(msg){
    var candidate = new RTCIceCandidate(msg.candidate);
    this.addIceCandidate(candidate).catch(reportError);    
}

//recieve video and audio-streams:
function handleTrackEvent(event){
    //add event.streams[0] as srcObject to audio/video object on page
    //adds hangup-button to user-gui 
}

//recieve stream-end signal:
function handleRemoveTrackEvent(event){
    //look out for end of tracks: 
    //var stream = recievedVideoTag.srcObject;
    //var tracklist = stream.getTracks();
    //if(trackList.length==0)closeVideoCall();
}

function hangUpCall(){
    //closeVideoCall();
    ws.sendMessage({name:ws.userName,senderId:ws.id,type:"hang-up"},"sendToAll");
}


peerworker.createPeerConnection = function (targetid){
    let pc = new RTCPeerConnection(this.iceservers);
  pc.targetUUID = targetid;
  pc.onicecandidate = handleICECandidateEvent;
  pc.ontrack = handleTrackEvent;
  pc.onnegotiationneeded = handleNegotiationNeededEvent;
  pc.onremovetrack = handleRemoveTrackEvent;
  pc.oniceconnectionstatechange = handleICEConnectionStateChangeEvent;
  pc.onicegatheringstatechange = handleICEGatheringStateChangeEvent;
  pc.onsignalingstatechange = handleSignalingStateChangeEvent;

  return pc;
}

function handleGetUserMediaError(e) {
  switch(e.name) {
    case "NotFoundError":
      alert("Unable to open your call because no camera and/or microphone" +
            "were found.");
      break;
    case "SecurityError":
    case "PermissionDeniedError":
      // Do nothing; this is the same as the user canceling the call.
      break;
    default:
      alert("Error opening your camera and/or microphone: " + e.message);
      break;
  }

  closeVideoCall();
}

