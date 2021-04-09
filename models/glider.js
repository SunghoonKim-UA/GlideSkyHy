const mongoose = require('mongoose');


const flightSchema = new mongoose.Schema({
  user_id: String,
  flight_id: String,
  start: String,
  end: String,
  duration: Number,
}, {collection:'flight'});

module.exports = mongoose.model('flight', flightSchema);


const gliderSchema = new mongoose.Schema({
  user_name: String,
  password: String,
  color: String
}, {collection:'glider'});

module.exports = mongoose.model('glider', gliderSchema);

const locationSchema = new mongoose.Schema({
  name: String,
  position: [Number],
  fly_object: [{ type: mongoose.Schema.Types.ObjectId, ref: 'glider' }]
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


const testSchema = new mongoose.Schema({
  Name: String,
  timestamp: Date,
  lat: Number,
  lng: Number,
  alt: Number,
  vertical_speed: Number,
}, {collection:'test'});

module.exports = mongoose.model('test', testSchema);


const realtimeSchema = new mongoose.Schema({
  Name: String,
  flight_id: String,
  timestamp: Date,
  lat: Number,
  lng: Number,
  alt: Number,
  vertical_speed: Number,
}, {collection:'realtime_tracking_db'});

module.exports = mongoose.model('realtime_tracking_db', realtimeSchema);

