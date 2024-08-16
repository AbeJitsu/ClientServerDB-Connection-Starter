const mongoose = require('mongoose');
const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
});
const Item = mongoose.model('Item', itemSchema);
module.exports = Item;

// server/src/models/Item.js
