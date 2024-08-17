const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      maxlength: [100, 'Item name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Add a text index for efficient text search
itemSchema.index({ name: 'text', description: 'text' });

// Virtual for item's URL
itemSchema.virtual('url').get(function () {
  return `/items/${this._id}`;
});

// Method to update quantity
itemSchema.methods.updateQuantity = function (newQuantity) {
  this.quantity = newQuantity;
  return this.save();
};

itemSchema.statics.getTotalQuantity = async function () {
  const result = await this.aggregate([
    { $group: { _id: null, totalQuantity: { $sum: '$quantity' } } },
  ]);
  return result.length > 0 ? result[0].totalQuantity : 0;
};

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;

// server/src/models/Item.js
