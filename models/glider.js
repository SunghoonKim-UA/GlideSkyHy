const mongoose = require('mongoose');

const gliderSchema = new mongoose.Schema({
  user_name: String,
  password: String
}, {collection:'glider'});

module.exports = mongoose.model('glider', gliderSchema);
