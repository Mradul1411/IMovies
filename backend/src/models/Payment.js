const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  paymentMethod: {
    type: String,
    enum: ['UPI', 'Credit/Debit Card', 'Netbanking', 'Wallet'],
    default: 'UPI'
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'refunded'],
    default: 'success'
  },
  gatewayResponse: {
    type: Object,
    default: {}
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
