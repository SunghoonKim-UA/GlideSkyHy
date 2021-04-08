const app = require('./app');

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Express is running on port ${server.address().port}`);
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
