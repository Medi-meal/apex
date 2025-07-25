const mongoose = require('mongoose');
const UserInputSchema = new mongoose.Schema({
  email: { type: String, required: true },
  input: { type: Object, required: true },
  recommendations: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('UserInput', UserInputSchema); 