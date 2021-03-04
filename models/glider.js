const mongoose = require('mongoose');

const gliderSchema = new mongoose.Schema({
  user_name: String,
  password: String
}, {collection:'glider'});

module.exports = mongoose.model('glider', gliderSchema);

const locationSchema = new mongoose.Schema({
  name: String,
  position: [Number]
}, {collection:'location'});

module.exports = mongoose.model('location', locationSchema);
