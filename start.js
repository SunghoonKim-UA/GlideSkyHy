const app = require('./app');

var serverhttp = require('http').Server(app);
const io = require('socket.io')(serverhttp);




io.on('connection', socket => {
	socket.on('join-room', (roomId, userId) => {
		console.log("[SOCKET SERVER] >>>>> roomId, userId");
		console.log(roomId, userId);

		socket.join(roomId); // joining room to user so that any time something happens in room, send it to socket
		socket.to(roomId).emit('user-connected', userId); // send it to everyone else in the same room but dont send it back to be

		socket.on('disconnect', () => { // handle lagged video removal eg clicking X button or gng to different URL handled by socket
			socket.to(roomId).emit('user-disconnected', userId);
		});

	});

});



const PORT = process.env.PORT || 3000;
const server = serverhttp.listen(PORT, () => {
  console.log(`Express is running on port ${serverhttp.address().port}`);
});

var https = require('https');
const fs = require('fs');
var key = fs.readFileSync('./selfsigned.key');
var cert = fs.readFileSync('./selfsigned.crt');

var credentials = {
  key: key,
  cert: cert
};

var httpsPort = 8443;
const httpsServer = https.createServer(credentials, app)
                         .listen(httpsPort, () => {
  console.log("Https server listing on port : " + httpsServer.address().port);
});







app.get('/videocall/:room', (req, res) => {
    console.log(req.path+"  :");

    res.render('room', {roomId: req.params.room});

});
