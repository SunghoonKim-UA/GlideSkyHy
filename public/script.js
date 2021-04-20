

console.log("Inside file room.js : " + ROOM_ID)

const socket = io('/')

const videoGrid = document.getElementById('video-grid')


var myPeer = new Peer(undefined, {
	//host: '/',     // DON'T specify 'host' and 'key' options, you will automatically connect to PeerServer Cloud service
	//port: '3001'
}); 

const myVideo = document.createElement('video')
myVideo.muted = true // mute ourselves
const peers = {}

// actually connect our camera
navigator.mediaDevices.getUserMedia({
	video: true,
	audio: true
}).then(stream => {
	addVideoStream(myVideo, stream)

	myPeer.on('call', call => {  // LISTEN to peer when they CALL
		call.answer(stream)   

		// we answered the call on one user, still need to respond to video streams coming in
		const otherVideo = document.createElement('video')

		call.on('stream', userVideoStream => {  // when they send us back their stream, listen here
			addVideoStream(otherVideo, userVideoStream)	 // add to our list of videos
		}) 

	})
	
	// allow connection from other users
	socket.on('user-connected', userId => {
		console.log("User connected : "+userId);
		connectToNewUser(userId, stream)
	});
})


socket.on('user-disconnected', userId => {
	console.log("User disconnected : "+userId);

	if(peers[userId]) peers[userId].close() // close call of this user
})


myPeer.on('open', id => {
	socket.emit('join-room', ROOM_ID, id)
}) // as soon as connected to peer, run this code



//socket.on('user-connected', userId => {
//	console.log("User connected : "+userId);
//});

// Now have roomId, userId



function addVideoStream(video, stream){
	video.srcObject = stream
	video.addEventListener('loadedmetadata', () => {
		video.play() // once loaded, play than video
	})
	videoGrid.append(video)
}


function connectToNewUser(userId, stream){ // Make CALLS
	const call = myPeer.call(userId, stream)  // CALL (peer) this userId and send our video and audio stream, userId was got from the newly connected user

	const otherVideo = document.createElement('video')

	call.on('stream', userVideoStream => {  // when they send us back their stream, listen here
		addVideoStream(otherVideo, userVideoStream)	 // add to our list of videos
	}) 

	call.on('close', () => {  // someone leaves the call, then close that video on GUI
		otherVideo.remove()
	})

	peers[userId] = call
}


