const mongoose = require('mongoose');

const lockedSeatSchema = new mongoose.Schema({
  seatId: { type: String, required: true },
  lockedBy: { type: String, required: true }, // socketId or userId
  expiresAt: { type: Date, required: true }
}, { _id: false });

const showSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
    index: true
  },
  theatreId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theatre',
    required: true,
    index: true
  },
  screenName: {
    type: String,
    default: 'Screen 1'
  },
  showDate: {
    type: String, // YYYY-MM-DD
    required: true,
    index: true
  },
  showTime: {
    type: String, // e.g. "10:30 AM"
    required: true
  },
  format: {
    type: String,
    default: '2D'
  },
  language: {
    type: String,
    default: 'English'
  },
  pricing: {
    vip: { type: Number, default: 450 },
    prime: { type: Number, default: 280 },
    classic: { type: Number, default: 180 }
  },
  totalSeats: {
    type: Number,
    default: 96
  },
  bookedSeats: [{
    type: String // e.g. "C-4", "F-9"
  }],
  lockedSeats: [lockedSeatSchema]
}, { timestamps: true });

showSchema.index({ movieId: 1, showDate: 1 });
showSchema.index({ theatreId: 1, showDate: 1 });

module.exports = mongoose.model('Show', showSchema);
