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


const historySchema = new mongoose.Schema({
  Name: String,
  timestamp: Date,
  lat: Number,
  lng: Number,
  alt: Number,
  vertical_speed: Number,
}, {collection:'flight_history'});

module.exports = mongoose.model('flight_history', historySchema);
