const mongoose = require('mongoose');

const bookedSeatItemSchema = new mongoose.Schema({
  seatId: { type: String, required: true },
  row: { type: String, required: true },
  number: { type: Number, required: true },
  tier: { type: String, enum: ['vip', 'prime', 'classic'], required: true },
  price: { type: Number, required: true }
}, { _id: false });

const snackItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  showId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show',
    required: true,
    index: true
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  theatreId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theatre',
    required: true
  },
  showDetails: {
    movieTitle: String,
    poster: String,
    theatreName: String,
    screenName: String,
    city: String,
    showDate: String,
    showTime: String,
    language: String,
    format: String
  },
  seats: [bookedSeatItemSchema],
  snacks: [snackItemSchema],
  subtotal: {
    type: Number,
    required: true
  },
  convenienceFee: {
    type: Number,
    default: 0
  },
  taxes: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed',
    index: true
  },
  paymentId: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    default: 'UPI'
  },
  cancellation: {
    cancelledAt: Date,
    refundAmount: Number,
    refundStatus: { type: String, enum: ['pending', 'processed', 'failed'], default: 'processed' },
    refundReason: String
  },
  qrCodeData: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
