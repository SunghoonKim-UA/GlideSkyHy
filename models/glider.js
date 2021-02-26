const mongoose = require('mongoose');

const gliderSchema = new mongoose.Schema({
  user_name: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model('glider', gliderSchema);
