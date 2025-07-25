const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false } // Make password optional for Google signups
});

module.exports = mongoose.model('User', userSchema);