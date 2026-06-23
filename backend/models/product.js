const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  startingBid: Number,
  currentBid: Number,
  currentWinner: String,
  endTime: Date,
  bids: [{ user: String, amount: Number, time: { type: Date, default: Date.now } }]
});
module.exports = mongoose.model('Product', productSchema);