require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection
  .on('open', () => {
    console.log('Mongoose connection open');
  })
  .on('error', (err) => {
    console.log(`Connection error: ${err.message}`);
  });

require('./models/glider');
const app = require('./app');

const PORT = process.env.PORT || 3000;
const httpserver = app.listen(PORT, () => {
  console.log(`Express is running on port ${server.address().port}`);
});

var https = require('https');
var key = fs.readFileSync('./selfsigned.key');
var cert = fs.readFileSync('./selfsigned.crt');

var credentials = {
  key: key,
  cert: cert
};

var httpsPort = 8443;
const httpsServer = https.createServer(credentials, app)
                         .listen(httpsPort, () => {
  console.log("Https server listing on port : " + httpsPort)
});
