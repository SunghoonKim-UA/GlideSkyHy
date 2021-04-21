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
  type: String,
  color: String,
  recent_flight_id: mongoose.Schema.Types.ObjectId
}, {collection:'glider'});

module.exports = mongoose.model('glider', gliderSchema);

const locationSchema = new mongoose.Schema({
  name: String,
  position: [Number],
  type: String,
  fly_object: [{ type: mongoose.Schema.Types.ObjectId, ref: 'glider' }]
}, {collection:'location'});

module.exports = mongoose.model('location', locationSchema);



const imagesSchema = new mongoose.Schema({
  name: String,
  image_url: String
}, {collection:'images'});

module.exports = mongoose.model('images', imagesSchema);


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
