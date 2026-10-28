const User = require('../models/User');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Show = require('../models/Show');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

// @desc    Get dashboard metrics & statistics
// @route   GET /api/admin/stats
// @access  Private / Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalMovies = await Movie.countDocuments({ isActive: true });
    const totalTheatres = await Theatre.countDocuments();
    const totalShows = await Show.countDocuments();
    const totalBookings = await Booking.countDocuments();

    // Calculate revenue
    const revenueAgg = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    // Recent 10 bookings
    const recentBookings = await Booking.find()
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(10);

    // Genre distribution
    const genreAgg = await Movie.aggregate([
      { $unwind: '$genres' },
      { $group: { _id: '$genres', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalBookings,
        totalMovies,
        totalTheatres,
        totalShows,
        totalUsers
      },
      recentBookings,
      genreDistribution: genreAgg
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (with pagination & status filter)
// @route   GET /api/admin/bookings
// @access  Private / Admin
exports.getAllBookings = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { bookingId: { $regex: search, $options: 'i' } },
        { 'showDetails.movieTitle': { $regex: search, $options: 'i' } },
        { 'showDetails.theatreName': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const bookings = await Booking.find(query)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      count: bookings.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};
