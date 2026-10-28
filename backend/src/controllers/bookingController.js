const Booking = require('../models/Booking');
const Show = require('../models/Show');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');

// Helper to generate unique booking ID
const generateBookingId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'IMV-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// @desc    Create new booking & process mock payment
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const { showId, seats, snacks = [], paymentMethod = 'UPI' } = req.body;

    if (!showId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid showId and at least one seat to book.'
      });
    }

    const show = await Show.findById(showId)
      .populate('movieId')
      .populate('theatreId');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    // Check if any of the requested seats are already booked
    const requestedSeatIds = seats.map(s => s.seatId);
    const alreadyBooked = show.bookedSeats.filter(s => requestedSeatIds.includes(s));

    if (alreadyBooked.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Seats already booked: ${alreadyBooked.join(', ')}. Please select other seats.`
      });
    }

    // Calculate financials
    let seatsTotal = 0;
    const formattedSeats = seats.map(seat => {
      const price = show.pricing[seat.tier] || 250;
      seatsTotal += price;
      return {
        seatId: seat.seatId,
        row: seat.row,
        number: seat.number,
        tier: seat.tier,
        price
      };
    });

    let snacksTotal = 0;
    const formattedSnacks = snacks.map(snack => {
      const lineTotal = snack.price * snack.quantity;
      snacksTotal += lineTotal;
      return {
        name: snack.name,
        quantity: snack.quantity,
        price: snack.price
      };
    });

    const subtotal = seatsTotal + snacksTotal;
    const convenienceFee = Math.round(seats.length * 32.5); // ₹32.5 per ticket
    const taxes = Math.round(convenienceFee * 0.18); // 18% GST on convenience fee
    const totalAmount = subtotal + convenienceFee + taxes;

    const bookingId = generateBookingId();
    const transactionId = 'TXN_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7).toUpperCase();

    // 1. Create Booking
    const booking = await Booking.create({
      bookingId,
      userId: req.user._id,
      showId: show._id,
      movieId: show.movieId._id,
      theatreId: show.theatreId._id,
      showDetails: {
        movieTitle: show.movieId.title,
        poster: show.movieId.poster,
        theatreName: show.theatreId.name,
        screenName: show.screenName,
        city: show.theatreId.city,
        showDate: show.showDate,
        showTime: show.showTime,
        language: show.language,
        format: show.format
      },
      seats: formattedSeats,
      snacks: formattedSnacks,
      subtotal,
      convenienceFee,
      taxes,
      totalAmount,
      status: 'confirmed',
      paymentId: transactionId,
      paymentMethod,
      qrCodeData: `IMOVIES|${bookingId}|${show.movieId.title}|${formattedSeats.map(s => s.seatId).join(',')}|${totalAmount}`
    });

    // 2. Create Payment record
    await Payment.create({
      bookingId: booking._id,
      userId: req.user._id,
      amount: totalAmount,
      paymentMethod,
      transactionId,
      status: 'success',
      gatewayResponse: { status: 'captured', auth_code: 'AUTH_' + Math.floor(100000 + Math.random() * 900000) }
    });

    // 3. Mark seats as permanently booked on Show & clear any locks
    show.bookedSeats.push(...requestedSeatIds);
    show.lockedSeats = show.lockedSeats.filter(l => !requestedSeatIds.includes(l.seatId));
    await show.save();

    // 4. Create in-app notification
    await Notification.create({
      userId: req.user._id,
      title: 'Booking Confirmed! 🎟️',
      message: `Your booking for ${show.movieId.title} at ${show.theatreId.name} on ${show.showDate} (${show.showTime}) is confirmed. Ref: ${bookingId}`,
      type: 'booking_success',
      metadata: {
        bookingId: booking.bookingId,
        movieId: show.movieId._id.toString()
      }
    });

    res.status(201).json({
      success: true,
      message: 'Booking successfully confirmed!',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's bookings (upcoming & past)
// @route   GET /api/bookings/my
// @access  Private
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('movieId', 'title poster certificate duration')
      .populate('theatreId', 'name city address')
      .sort({ createdAt: -1 });

    const todayStr = new Date().toISOString().split('T')[0];

    const upcoming = [];
    const past = [];

    bookings.forEach(b => {
      const showDate = b.showDetails?.showDate || '';
      if (b.status === 'confirmed' && showDate >= todayStr) {
        upcoming.push(b);
      } else {
        past.push(b);
      }
    });

    res.json({
      success: true,
      count: bookings.length,
      upcoming,
      past,
      all: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res, next) => {
  try {
    let booking;
    // Check if ID is MongoDB _id or bookingId string (e.g. IMV-XXXXXX)
    if (req.params.id.startsWith('IMV-')) {
      booking = await Booking.findOne({ bookingId: req.params.id })
        .populate('movieId')
        .populate('theatreId');
    } else {
      booking = await Booking.findById(req.params.id)
        .populate('movieId')
        .populate('theatreId');
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify ownership or admin
    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this booking'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   POST /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled.'
      });
    }

    // Calculate refund: full subtotal minus convenience fee
    const refundAmount = booking.subtotal;
    booking.status = 'cancelled';
    booking.cancellation = {
      cancelledAt: new Date(),
      refundAmount,
      refundStatus: 'processed',
      refundReason: req.body.reason || 'User requested cancellation'
    };

    await booking.save();

    // Release seats on Show
    const seatIdsToRelease = booking.seats.map(s => s.seatId);
    await Show.findByIdAndUpdate(booking.showId, {
      $pull: { bookedSeats: { $in: seatIdsToRelease } }
    });

    // Update payment record
    await Payment.findOneAndUpdate(
      { bookingId: booking._id },
      { status: 'refunded' }
    );

    // Create Notification
    await Notification.create({
      userId: req.user._id,
      title: 'Booking Cancelled',
      message: `Your booking ${booking.bookingId} for ${booking.showDetails.movieTitle} has been cancelled. Refund of ₹${refundAmount} has been initiated.`,
      type: 'cancellation',
      metadata: { bookingId: booking.bookingId }
    });

    res.json({
      success: true,
      message: `Booking cancelled successfully! ₹${refundAmount} will be refunded within 3-5 business days.`,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};
