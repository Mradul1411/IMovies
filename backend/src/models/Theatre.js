const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
  screenNumber: { type: Number, required: true },
  name: { type: String, required: true }, // e.g. "Audi 1 - IMAX with Laser", "Audi 2 - Dolby Atmos"
  format: { type: String, default: '2D' },
  seatCapacity: { type: Number, default: 120 }
});

const theatreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Theatre name is required'],
    trim: true
  },
  chain: {
    type: String,
    default: 'PVR INOX' // PVR, INOX, Cinepolis, Miraj, MovieMax
  },
  city: {
    type: String,
    required: true,
    index: true
  },
  address: {
    type: String,
    required: true
  },
  landmark: {
    type: String,
    default: ''
  },
  amenities: [{
    type: String
  }],
  screens: [screenSchema],
  cancellationAvailable: {
    type: Boolean,
    default: true
  },
  foodBeverageAvailable: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

theatreSchema.index({ city: 1, name: 1 });

module.exports = mongoose.model('Theatre', theatreSchema);
