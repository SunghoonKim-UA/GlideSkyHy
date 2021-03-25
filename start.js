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
const server = app.listen(PORT, () => {
  console.log(`Express is running on port ${server.address().port}`);
});
