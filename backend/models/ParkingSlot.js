const mongoose = require('mongoose');

const parkingSlotSchema = new mongoose.Schema(
  {
    slotNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['Standard', 'Compact', 'Disabled', 'Electric'],
      default: 'Standard',
    },
    availability: {
      type: Boolean,
      default: true,
    },
    pricePerHour: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ParkingSlot', parkingSlotSchema);