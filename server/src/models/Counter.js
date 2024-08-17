// models/Counter.js
const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Counter name is required'],
      unique: true,
      trim: true,
      maxlength: [100, 'Counter name cannot be more than 100 characters'],
    },
    value: {
      type: Number,
      default: 0,
      min: [0, 'Counter value cannot be negative'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Method to increment the counter
counterSchema.methods.increment = async function (amount = 1) {
  this.value += amount;
  this.lastUpdated = Date.now();
  return this.save();
};

// Method to reset the counter
counterSchema.methods.reset = async function () {
  this.value = 0;
  this.lastUpdated = Date.now();
  return this.save();
};

// Static method to get or create a counter
counterSchema.statics.getOrCreate = async function (name, description = '') {
  let counter = await this.findOne({ name });
  if (!counter) {
    counter = new this({ name, description });
    await counter.save();
  }
  return counter;
};

counterSchema.virtual('url').get(function () {
  return `/counters/${this._id}`;
});

const Counter = mongoose.model('Counter', counterSchema);

module.exports = Counter;

// server/src/models/Counter.js
