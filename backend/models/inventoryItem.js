const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  qty: { type: Number, default: 1 },
  price: { type: Number, default: 0 },
  image: String, // path to uploaded image
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);
